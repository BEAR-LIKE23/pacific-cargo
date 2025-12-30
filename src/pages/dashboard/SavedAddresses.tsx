
// Pacific Cargo - Saved Addresses
import { useState, useEffect } from 'react';
import UserLayout from '../../layouts/UserLayout';
import { supabase } from '../../lib/supabase';
import { MapPin, Plus, Trash2, Edit2, Search, X, Save, Phone, User, Mail } from 'lucide-react';
import Toast, { ToastType } from '../../components/Toast';

const SavedAddresses = () => {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        label: '',
        full_name: '',
        address: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type });
    };

    const fetchAddresses = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('user_addresses')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAddresses(data || []);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (address: any) => {
        setEditingId(address.id);
        setFormData({
            label: address.label,
            full_name: address.full_name,
            address: address.address,
            phone: address.phone,
            email: address.email || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const { error } = await supabase
                .from('user_addresses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            showToast('Address deleted');
            fetchAddresses();
        } catch (error) {
            showToast('Error deleting address', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            if (editingId) {
                const { error } = await supabase
                    .from('user_addresses')
                    .update(formData)
                    .eq('id', editingId);
                if (error) throw error;
                showToast('Address updated');
            } else {
                const { error } = await supabase
                    .from('user_addresses')
                    .insert([{ ...formData, user_id: user.id }]);
                if (error) throw error;
                showToast('Address saved');
            }

            setShowModal(false);
            setEditingId(null);
            setFormData({ label: '', full_name: '', address: '', phone: '', email: '' });
            fetchAddresses();
        } catch (error: any) {
            showToast(error.message || 'Error saving address', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredAddresses = addresses.filter(addr =>
        addr.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        addr.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <UserLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Address Book</h1>
                    <p className="text-slate-500 font-medium">Save frequently used sender or receiver details.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ label: '', full_name: '', address: '', phone: '', email: '' });
                        setShowModal(true);
                    }}
                    className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-700 transition shadow-lg shadow-brand-200"
                >
                    <Plus size={20} /> Add New Address
                </button>
            </div>

            <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by label or name..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-400">Loading addresses...</div>
            ) : filteredAddresses.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                    <MapPin className="mx-auto text-slate-200 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-slate-900">No addresses saved yet</h3>
                    <p className="text-slate-400">Your saved addresses will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAddresses.map((addr) => (
                        <div key={addr.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition group relative">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-brand-50 text-brand-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded">
                                    {addr.label}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <button onClick={() => handleEdit(addr)} className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(addr.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <User size={16} className="text-slate-400" /> {addr.full_name}
                            </h3>
                            <p className="text-sm text-slate-500 mb-4 flex items-start gap-2">
                                <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                {addr.address}
                            </p>

                            <div className="space-y-2 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Phone size={14} className="text-slate-300" />
                                    {addr.phone}
                                </div>
                                {addr.email && (
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Mail size={14} className="text-slate-300" />
                                        {addr.email}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-900">
                                    {editingId ? 'Edit Address' : 'Add New Address'}
                                </h3>
                                <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Label (e.g. Home, Office)</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                                        value={formData.label}
                                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Complete Address</label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Email (Optional)</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition flex items-center gap-2 disabled:opacity-75"
                                >
                                    {submitting ? 'Saving...' : <><Save size={18} /> Save Address</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </UserLayout>
    );
};

export default SavedAddresses;

