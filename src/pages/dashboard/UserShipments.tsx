import { useState, useEffect, useRef } from 'react';
import UserLayout from '../../layouts/UserLayout';
import { Search, Eye, Download, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import WaybillTemplate from '../../components/WaybillTemplate';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Toast, { ToastType } from '../../components/Toast';

const UserShipments = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [shipments, setShipments] = useState<any[]>([]);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const waybillRef = useRef<HTMLDivElement>(null);
    const [selectedShipment, setSelectedShipment] = useState<any>(null);

    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    navigate('/login');
                    return;
                }

                const { data } = await supabase
                    .from('shipments')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                setShipments(data || []);
            } catch (error) {
                console.error('Error fetching shipments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchShipments();
    }, [navigate]);

    const handleDownloadWaybill = async (shipment: any) => {
        setDownloadingId(shipment.id);
        setSelectedShipment(shipment);

        // Give React time to render the hidden template
        setTimeout(async () => {
            try {
                if (!waybillRef.current) throw new Error('Template ref not found');

                const canvas = await (html2canvas as any)(waybillRef.current, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });

                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save(`WAYBILL-${shipment.tracking_code}.pdf`);
                setToast({ message: 'Waybill downloaded successfully!', type: 'success' });
            } catch (error) {
                console.error('PDF Generation Error:', error);
                setToast({ message: 'Failed to generate PDF. Please try again.', type: 'error' });
            } finally {
                setDownloadingId(null);
                setSelectedShipment(null);
            }
        }, 500);
    };

    return (
        <UserLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Hidden Template for PDF Capture */}
            <div className="fixed -left-[1000vw] -top-[1000vh]">
                {selectedShipment && (
                    <WaybillTemplate ref={waybillRef} shipment={selectedShipment} />
                )}
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Shipments</h1>
                    <p className="text-slate-500 font-medium">View and track all your shipments.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-slate-900">All Shipments</h2>
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search tracking ID..."
                            className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-100 focus:border-brand-500 outline-none w-full md:w-64 transition"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-8 py-5">Tracking ID</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Destination</th>
                                <th className="px-8 py-5">Cost</th>
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-slate-500">Loading shipments...</td>
                                </tr>
                            ) : shipments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-slate-500">No shipments found.</td>
                                </tr>
                            ) : (
                                shipments.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-slate-50/80 transition group">
                                        <td className="px-8 py-5 text-sm font-bold text-slate-900">{item.tracking_code}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${item.status === 'In Transit' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                item.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-slate-500">{item.destination}</td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-700">₦{item.cost?.toLocaleString() || '0.00'}</td>
                                        <td className="px-8 py-5 text-sm text-slate-500">{new Date(item.created_at).toLocaleDateString()}</td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => navigate(`/track?code=${item.tracking_code}`)}
                                                    className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center gap-1 transition-colors"
                                                    title="Track Shipment"
                                                >
                                                    <Eye size={16} /> Track
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadWaybill(item)}
                                                    disabled={downloadingId === item.id}
                                                    className="text-slate-600 hover:text-slate-900 font-medium text-sm flex items-center gap-1 disabled:opacity-50 transition-colors"
                                                    title="Download Waybill"
                                                >
                                                    {downloadingId === item.id ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <Download size={16} />
                                                    )}
                                                    Waybill
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
        </UserLayout>
    );
};

export default UserShipments;
