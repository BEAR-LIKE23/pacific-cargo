import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Search, CheckCircle, XCircle, AlertCircle, Edit2, MapPin, Save, X, Plus } from 'lucide-react';
import Toast, { ToastType } from '../../components/Toast';

const AdminShipments = () => {
    const [shipments, setShipments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending_approval, in_transit
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    // Edit Modal State
    const [editingShipment, setEditingShipment] = useState<any>(null);
    const [editForm, setEditForm] = useState({ status: '', current_location: '' });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        let subscription: any;

        const fetchShipments = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('shipments')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) console.error(error);
            if (data) setShipments(data);
            setLoading(false);

            // Subscribe to all shipment changes
            subscription = supabase
                .channel('admin_shipment_updates')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'shipments'
                }, (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setShipments(prev => [payload.new, ...prev]);
                        showToast(`New shipment created: ${payload.new.tracking_code}`, 'info');
                    } else if (payload.eventType === 'UPDATE') {
                        setShipments(prev => prev.map(s => s.id === payload.new.id ? payload.new : s));
                    } else if (payload.eventType === 'DELETE') {
                        setShipments(prev => prev.filter(s => s.id !== payload.old.id));
                    }
                })
                .subscribe();
        };

        fetchShipments();

        return () => {
            if (subscription) supabase.removeChannel(subscription);
        };
    }, []);

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type });
    };

    const handleApprovePayment = async (id: string) => {
        if (!confirm('Confirm payment securely received? This will mark the shipment as Paid.')) return;

        const { error } = await supabase
            .from('shipments')
            .update({
                payment_status: 'Paid',
                status: 'Pending'
            })
            .eq('id', id);

        if (error) {
            showToast('Error approving payment', 'error');
        } else {
            showToast('Payment Approved');
        }
    };

    const handleRejectPayment = async (id: string) => {
        if (!confirm('Reject this payment proof?')) return;
        const { error } = await supabase
            .from('shipments')
            .update({ payment_status: 'Rejected' })
            .eq('id', id);

        if (error) showToast('Error rejecting payment', 'error');
        else showToast('Payment Rejected', 'info');
    };

    const openEditModal = (shipment: any) => {
        setEditingShipment(shipment);
        setEditForm({
            status: shipment.status || 'Pending',
            current_location: shipment.current_location || ''
        });
    };

    const closeEditModal = () => {
        setEditingShipment(null);
        setEditForm({ status: '', current_location: '' });
    };

    const handleUpdateShipment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingShipment) return;
        setUpdating(true);

        const { error } = await supabase
            .from('shipments')
            .update({
                status: editForm.status,
                current_location: editForm.current_location
            })
            .eq('id', editingShipment.id);

        setUpdating(false);

        if (error) {
            showToast('Failed to update shipment.', 'error');
            console.error(error);
        } else {
            showToast('Shipment Updated successfully');
            closeEditModal();
        }
    };

    const filteredShipments = shipments.filter(shipment => {
        if (filter === 'pending_approval' && shipment.payment_status !== 'Pending Confirmation') return false;
        if (filter === 'in_transit' && shipment.status !== 'In Transit') return false;
        return shipment.tracking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (shipment.receiver_name && shipment.receiver_name.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    return (
        <AdminLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Shipment Management</h1>
                    <p className="text-slate-500">View and manage all user shipments</p>
                </div>
                <Link to="/admin/create-shipment" className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700 transition">
                    <Plus size={20} /> New Shipment
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search Tracking ID or Receiver..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All Shipments" />
                    <FilterButton active={filter === 'pending_approval'} onClick={() => setFilter('pending_approval')} label="Pending Approvals" count={shipments.filter(s => s.payment_status === 'Pending Confirmation').length} />
                    <FilterButton active={filter === 'in_transit'} onClick={() => setFilter('in_transit')} label="In Transit" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-xs text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Tracking ID</th>
                                <th className="px-6 py-4">Sender / Receiver</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center">Loading shipments...</td></tr>
                            ) : filteredShipments.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No shipments found.</td></tr>
                            ) : (
                                filteredShipments.map((shipment) => (
                                    <tr key={shipment.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-mono font-bold text-slate-900">{shipment.tracking_code}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{shipment.sender_name}</div>
                                            <div className="text-xs text-slate-400">To: {shipment.receiver_name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={shipment.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <MapPin size={14} className="text-slate-400" />
                                                <span className="truncate max-w-[150px]" title={shipment.current_location}>
                                                    {shipment.current_location || 'Origin'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <PaymentBadge status={shipment.payment_status || 'Unpaid'} />
                                            {shipment.payment_receipt && (
                                                <a href={shipment.payment_receipt} target="_blank" rel="noopener noreferrer" className="block text-[10px] text-blue-600 hover:underline mt-1 truncate max-w-[100px]">
                                                    View Receipt
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {shipment.payment_status === 'Pending Confirmation' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprovePayment(shipment.id)}
                                                            className="bg-emerald-100 text-emerald-700 p-2 rounded hover:bg-emerald-200 transition"
                                                            title="Approve Payment"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectPayment(shipment.id)}
                                                            className="bg-red-100 text-red-700 p-2 rounded hover:bg-red-200 transition"
                                                            title="Reject Payment"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => openEditModal(shipment)}
                                                    className="bg-slate-100 text-slate-600 p-2 rounded hover:bg-brand-50 hover:text-brand-600 transition"
                                                    title="Edit Shipment"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingShipment && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <form onSubmit={handleUpdateShipment}>
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Update Shipment</h3>
                                    <p className="text-slate-500 text-sm font-mono">{editingShipment.tracking_code}</p>
                                </div>
                                <button type="button" onClick={closeEditModal} className="text-slate-400 hover:text-slate-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Shipment Status</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Pending', 'In Transit', 'On Hold', 'Delivered'].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setEditForm({ ...editForm, status: s })}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${editForm.status === s
                                                    ? 'bg-brand-50 border-brand-200 text-brand-700 ring-2 ring-brand-500/20'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={editForm.current_location}
                                            onChange={(e) => setEditForm({ ...editForm, current_location: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                                            placeholder="e.g. Distribution Center, Lagos"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Updating this will reflect on the public tracking page immediately.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition flex items-center gap-2 disabled:opacity-75"
                                >
                                    {updating ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

const FilterButton = ({ active, onClick, label, count }: any) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${active ? 'bg-brand-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
    >
        {label}
        {count !== undefined && <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-slate-100'}`}>{count}</span>}
    </button>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-100',
        'In Transit': 'bg-blue-50 text-blue-700 border-blue-100',
        'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'On Hold': 'bg-red-50 text-red-700 border-red-100',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
            {status}
        </span>
    );
};

const PaymentBadge = ({ status }: { status: string }) => {
    const styles: any = {
        'Paid': 'bg-emerald-100 text-emerald-800',
        'Pending Confirmation': 'bg-orange-100 text-orange-800 animate-pulse',
        'Unpaid': 'bg-slate-100 text-slate-500',
        'Rejected': 'bg-red-100 text-red-800',
    };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${styles[status] || 'bg-slate-100'}`}>
            {status === 'Pending Confirmation' && <AlertCircle size={10} />}
            {status}
        </span>
    );
};

export default AdminShipments;
