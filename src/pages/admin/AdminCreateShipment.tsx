import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout'; // Changed to AdminLayout
import { Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Toast, { ToastType } from '../../components/Toast';

const AdminCreateShipment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [trackingId] = useState('PCL-' + Math.floor(10000000 + Math.random() * 90000000));
    const [user, setUser] = useState<any>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type });
    };

    // Form State
    const [formData, setFormData] = useState({
        sender_name: '', sender_address: '', sender_contact: '', sender_email: '',
        receiver_name: '', receiver_address: '', receiver_contact: '', receiver_email: '',
        status: 'Pending',
        current_location: '',
        carrier: '',
        reference_number: '',
        weight: '',
        quantity: '1',
        shipment_mode: 'Air Freight',
        destination: '',
        payment_mode: 'Paid', // Default to Paid for Admin
        dispatch_date: '',
        estimated_delivery: '',
        delivery_time: '',
        package_description: '',
    });

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) navigate('/admin/login');
            setUser(user);
        };
        getUser();
    }, []);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateShipment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Admin Create Shipment - No Payment/Wallet Check needed

            const { error: shipmentError } = await supabase.from('shipments').insert({
                tracking_code: trackingId,
                user_id: user.id, // Or allow selecting a user? For now, admin is the creator/owner
                ...formData,
                status: formData.status, // Allow setting status immediately
                payment_status: 'Paid', // Admin shipments are Paid/Free
                cost: 0, // Free
                package_type: 'Package'
            });

            if (shipmentError) throw shipmentError;

            if (shipmentError) throw shipmentError;

            showToast(`Admin Shipment Created! Tracking ID: ${trackingId}`);
            setTimeout(() => navigate('/admin/shipments'), 2000);

        } catch (error: any) {
            console.error(error);
            showToast('Error creating shipment: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Create New Shipment (Admin)</h1>
                    <p className="text-slate-500">Create a shipment with full control and 0 cost.</p>
                </div>
                <div className="bg-brand-50 px-4 py-2 rounded-lg border border-brand-100 hidden md:block">
                    <span className="text-xs font-bold text-brand-800 uppercase tracking-widest">Generating ID</span>
                    <p className="text-xl font-mono font-bold text-brand-600">{trackingId}</p>
                </div>
            </div>

            <form onSubmit={handleCreateShipment} className="space-y-6 max-w-5xl mx-auto pb-12">

                <div className="animate-fade-in-up space-y-6">
                    {/* Section 1: Contact Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Sender */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Sender Information
                            </h3>
                            <div className="space-y-4">
                                <Input name="sender_name" label="Full Name *" value={formData.sender_name} placeholder="Enter sender name" onChange={handleChange} required />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input name="sender_contact" label="Contact *" value={formData.sender_contact} placeholder="Phone number" onChange={handleChange} required />
                                    <Input name="sender_email" label="Email *" value={formData.sender_email} placeholder="email@example.com" type="email" onChange={handleChange} required />
                                </div>
                                <Input name="sender_address" label="Address *" value={formData.sender_address} placeholder="Full address" onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Receiver */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Receiver Information
                            </h3>
                            <div className="space-y-4">
                                <Input name="receiver_name" label="Full Name *" value={formData.receiver_name} placeholder="Enter receiver name" onChange={handleChange} required />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input name="receiver_contact" label="Contact *" value={formData.receiver_contact} placeholder="Phone number" onChange={handleChange} required />
                                    <Input name="receiver_email" label="Email *" value={formData.receiver_email} placeholder="email@example.com" type="email" onChange={handleChange} required />
                                </div>
                                <Input name="receiver_address" label="Address *" value={formData.receiver_address} placeholder="Full address" onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Shipment Details */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 block border-b pb-2">Shipment Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Select name="status" label="Initial Status" value={formData.status} options={['Pending', 'In Transit', 'On Hold', 'Delivered']} onChange={handleChange} />
                            <Input name="current_location" label="Dispatch Location *" value={formData.current_location} placeholder="Origin City" onChange={handleChange} required />
                            <Input name="carrier" label="Carrier *" value={formData.carrier} placeholder="Carrier Name" onChange={handleChange} required />

                            <Input name="reference_number" label="Reference Number *" value={formData.reference_number} placeholder="REF-XXXXX" onChange={handleChange} />
                            <Input name="weight" label="Weight (kg) *" value={formData.weight} placeholder="0.00" type="number" onChange={handleChange} required />
                            <Input name="quantity" label="Quantity *" value={formData.quantity} placeholder="1" type="number" onChange={handleChange} required />

                            <Select name="shipment_mode" label="Shipment Mode *" value={formData.shipment_mode} options={['Air Freight', 'Sea Freight', 'Ground Shipping']} onChange={handleChange} />
                            <Input name="destination" label="Destination *" value={formData.destination} placeholder="Destination City" onChange={handleChange} required />
                            <Select name="payment_mode" label="Payment Mode" value={formData.payment_mode} options={['Paid', 'Pay on Delivery', 'Pending']} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Section 3: Timeline & Package */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 text-purple-700">Timeline</h3>
                            <div className="space-y-4">
                                <Input name="dispatch_date" label="Dispatch Date *" value={formData.dispatch_date} type="date" onChange={handleChange} required />
                                <Input name="estimated_delivery" label="Est. Delivery Date *" value={formData.estimated_delivery} type="date" onChange={handleChange} required />
                                <Input name="delivery_time" label="Delivery Time *" value={formData.delivery_time} type="time" onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 text-pink-700">Package Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Package Description *</label>
                                    <textarea
                                        name="package_description"
                                        value={formData.package_description}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                                        rows={3}
                                        placeholder="Describe contents..."
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={loading} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-lg">
                            {loading ? 'Creating...' : <><Box size={20} /> Create Shipment</>}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
};

const Input = ({ label, type = "text", value, placeholder, name, onChange, required }: any) => (
    <div>
        {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
        <input
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            required={required}
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition outline-none bg-white"
        />
    </div>
);

const Select = ({ label, options, value, name, onChange }: any) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select name={name} value={value} onChange={onChange} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition outline-none bg-white">
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default AdminCreateShipment;
