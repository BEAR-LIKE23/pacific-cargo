
import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Save, ArrowLeft, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateShipment = () => {
    const navigate = useNavigate();
    const [trackingId] = useState('PAC-' + Math.floor(100000 + Math.random() * 900000));

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-brand-600 mb-2 transition">
                        <ArrowLeft size={16} className="mr-1" /> Back
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Create New Shipment</h1>
                    <p className="text-slate-500">Fill in the shipment details below</p>
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                    <span className="text-xs font-bold text-orange-800 uppercase tracking-widest">Tracking Number</span>
                    <p className="text-xl font-mono font-bold text-orange-600">{trackingId}</p>
                </div>
            </div>

            <form className="space-y-6">
                {/* Section 1: Contact Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sender */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Sender Information
                        </h3>
                        <div className="space-y-4">
                            <Input label="Full Name *" placeholder="Enter sender name" />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Contact *" placeholder="Phone number" />
                                <Input label="Email *" placeholder="email@example.com" type="email" />
                            </div>
                            <Input label="Address *" placeholder="Full address" />
                        </div>
                    </div>

                    {/* Receiver */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Receiver Information
                        </h3>
                        <div className="space-y-4">
                            <Input label="Full Name *" placeholder="Enter receiver name" />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Contact *" placeholder="Phone number" />
                                <Input label="Email *" placeholder="email@example.com" type="email" />
                            </div>
                            <Input label="Address *" placeholder="Full address" />
                        </div>
                    </div>
                </div>

                {/* Section 2: Shipment Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 block border-b pb-2">Shipment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Select label="Current Status *" options={['Pending', 'In Transit', 'On Hold', 'Delivered']} />
                        <Input label="Dispatch Location *" placeholder="Origin City" />
                        <Input label="Carrier *" placeholder="Carrier Name" />

                        <Input label="Reference Number *" placeholder="REF-XXXXX" />
                        <Input label="Weight (kg) *" placeholder="0.00" type="number" />
                        <Input label="Quantity *" placeholder="1" type="number" />

                        <Select label="Shipment Mode *" options={['Air Freight', 'Sea Freight', 'Ground Shipping']} />
                        <Input label="Destination *" placeholder="Destination City" />
                        <Select label="Payment Mode *" options={['Paid', 'Pay on Delivery', 'Pending']} />
                    </div>
                </div>

                {/* Section 3: Timeline & Package */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 text-purple-700">Timeline</h3>
                        <div className="space-y-4">
                            <Input label="Dispatch Date *" type="date" />
                            <Input label="Est. Delivery Date *" type="date" />
                            <Input label="Delivery Time *" type="time" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 text-pink-700">Package Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Package Description *</label>
                                <textarea className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none" rows={3} placeholder="Describe contents..."></textarea>
                            </div>
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition cursor-pointer">
                                <Upload className="mx-auto text-slate-400 mb-2" />
                                <p className="text-sm text-slate-500">Click to upload Image</p>
                                <p className="text-xs text-slate-400">PNG, JPG up to 2MB</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-brand-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-700 transition flex items-center gap-2">
                        <Save size={20} />
                        Create Shipment
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
};

const Input = ({ label, type = "text", placeholder }: { label: string, type?: string, placeholder?: string }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition outline-none"
        />
    </div>
);

const Select = ({ label, options }: { label: string, options: string[] }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition outline-none bg-white">
            <option>Select...</option>
            {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
    </div>
);

export default CreateShipment;
