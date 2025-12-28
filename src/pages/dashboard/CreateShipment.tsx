import { useState, useEffect } from 'react';
import UserLayout from '../../layouts/UserLayout';
import { ArrowLeft, CreditCard, CheckCircle2, ArrowRight, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Toast, { ToastType } from '../../components/Toast';

const CreateShipment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1 = Details, 2 = Payment
    const [trackingId] = useState('PCL-' + Math.floor(10000000 + Math.random() * 90000000));
    const [user, setUser] = useState<any>(null);
    const [balance, setBalance] = useState(0);
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
        payment_mode: 'Pending',
        dispatch_date: '',
        estimated_delivery: '',
        delivery_time: '',
        package_description: '',
    });

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) navigate('/login');
            setUser(user);

            // Fetch Balance
            const { data: profile } = await supabase.from('profiles').select('balance').eq('id', user?.id).single();
            if (profile) setBalance(profile.balance);
        };
        getUser();
    }, []);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = (e: any) => {
        e.preventDefault();
        // Basic validation could go here
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handleWalletPayment = async () => {
        setLoading(true);
        try {
            // 1. Double check balance (Client side check for UI)
            if (balance < 10000) {
                showToast('Insufficient funds. Please fund your wallet.', 'error');
                setLoading(false);
                return;
            }

            // 2. Transact securely using RPC
            const { error: payError } = await supabase.rpc('pay_for_shipment', {
                shipment_cost: 10000,
                tracking_id: trackingId
            });

            if (payError) throw payError;

            // 3. Create Shipment
            const { error: shipmentError } = await supabase.from('shipments').insert({
                tracking_code: trackingId,
                user_id: user.id,
                ...formData,
                status: 'Pending',
                payment_status: 'Paid',
                cost: 10000,
                package_type: 'Package'
            });

            if (shipmentError) throw shipmentError;

            if (shipmentError) throw shipmentError;

            showToast(`Shipment Registered! Tracking ID: ${trackingId}`);
            setTimeout(() => navigate('/dashboard'), 2000);

        } catch (error: any) {
            console.error(error);
            showToast('Payment/Booking failed: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="flex items-center justify-between mb-6">
                <div>
                    {step === 1 ? (
                        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-brand-600 mb-2 transition">
                            <ArrowLeft size={16} className="mr-1" /> Back
                        </button>
                    ) : (
                        <button onClick={() => setStep(1)} className="flex items-center text-slate-500 hover:text-brand-600 mb-2 transition">
                            <ArrowLeft size={16} className="mr-1" /> Back to Details
                        </button>
                    )}

                    <h1 className="text-2xl font-bold text-slate-900">
                        {step === 1 ? 'Create New Shipment' : 'Complete Payment'}
                    </h1>
                    <p className="text-slate-500">
                        {step === 1 ? 'Fill in the shipment details below' : 'Make payment to proceed'}
                    </p>
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                    <span className="text-xs font-bold text-orange-800 uppercase tracking-widest">Tracking Number</span>
                    <p className="text-xl font-mono font-bold text-orange-600">{trackingId}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-4 mb-8">
                <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-brand-600' : 'bg-slate-200'}`}></div>
                <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-brand-600' : 'bg-slate-200'}`}></div>
            </div>

            <form onSubmit={step === 1 ? handleNext : handleWalletPayment} className="space-y-6">

                {/* STEP 1: DETAILS */}
                {step === 1 && (
                    <div className="animate-fade-in-up">
                        {/* Section 1: Contact Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 block border-b pb-2">Shipment Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Select name="status" label="Current Status *" value={formData.status} options={['Pending', 'In Transit', 'On Hold', 'Delivered']} onChange={handleChange} />
                                <Input name="current_location" label="Dispatch Location *" value={formData.current_location} placeholder="Origin City" onChange={handleChange} required />
                                <Input name="carrier" label="Carrier *" value={formData.carrier} placeholder="Carrier Name" onChange={handleChange} required />

                                <Input name="reference_number" label="Reference Number *" value={formData.reference_number} placeholder="REF-XXXXX" onChange={handleChange} />
                                <Input name="weight" label="Weight (kg) *" value={formData.weight} placeholder="0.00" type="number" onChange={handleChange} required />
                                <Input name="quantity" label="Quantity *" value={formData.quantity} placeholder="1" type="number" onChange={handleChange} required />

                                <Select name="shipment_mode" label="Shipment Mode *" value={formData.shipment_mode} options={['Air Freight', 'Sea Freight', 'Ground Shipping']} onChange={handleChange} />
                                <Input name="destination" label="Destination *" value={formData.destination} placeholder="Destination City" onChange={handleChange} required />
                                <Select name="payment_mode" label="Payment Mode *" value={formData.payment_mode} options={['Paid', 'Pay on Delivery', 'Pending']} onChange={handleChange} />
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
                                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition cursor-pointer">
                                        <Upload className="mx-auto text-slate-400 mb-2" />
                                        <p className="text-sm text-slate-500">Click to upload Image</p>
                                        <p className="text-xs text-slate-400">PNG, JPG up to 2MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-8">
                            <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center gap-2">
                                Proceed to Payment <CreditCard size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: WALLET PAYMENT */}
                {step === 2 && (
                    <div className="max-w-xl mx-auto animate-fade-in-up">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 mb-8">
                            <div className="bg-slate-900 p-6 text-white text-center">
                                <h2 className="text-xl font-bold mb-1">Confirm Payment</h2>
                                <p className="text-slate-400 text-sm">Payment will be deducted from your wallet</p>
                            </div>

                            <div className="p-8 space-y-6">
                                {/* Cost Summary */}
                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-slate-600 font-medium">Total Shipment Cost</span>
                                    <span className="text-2xl font-bold text-slate-900">₦10,000.00</span>
                                </div>

                                {/* Wallet Balance */}
                                <div className={`flex justify-between items-center p-4 rounded-xl border ${balance >= 10000 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${balance >= 10000 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            <CreditCard size={20} />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${balance >= 10000 ? 'text-emerald-800' : 'text-red-800'}`}>Wallet Balance</p>
                                            <p className={`text-xs ${balance >= 10000 ? 'text-emerald-600' : 'text-red-600'}`}>Available Funds</p>
                                        </div>
                                    </div>
                                    <span className={`text-xl font-bold ${balance >= 10000 ? 'text-emerald-700' : 'text-red-700'}`}>
                                        ₦{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>

                                {balance < 10000 && (
                                    <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg flex gap-2">
                                        <div className="shrink-0 mt-0.5">⚠️</div>
                                        <p>Insufficient funds. Please fund your wallet to proceed with this shipment.</p>
                                    </div>
                                )}
                            </div>

                            <div className="px-8 pb-8">
                                {balance >= 10000 ? (
                                    <button
                                        type="button"
                                        onClick={handleWalletPayment}
                                        disabled={loading}
                                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Processing...' : 'Pay ₦10,000 & Submit'} <CheckCircle2 size={20} />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => navigate('/dashboard/wallet')}
                                        className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2"
                                    >
                                        Fund Wallet Now <ArrowRight size={20} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full mt-4 text-slate-500 font-bold hover:text-slate-700 transition"
                                >
                                    Back to Details
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </UserLayout>
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

export default CreateShipment;
