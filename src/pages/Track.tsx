
import React, { useState } from 'react';
import PublicLayout from '../layouts/PublicLayout';
import { Search, Clock, Package, Truck, ArrowRight } from 'lucide-react';

const TrackPage = () => {
    const [trackingId, setTrackingId] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (trackingId.toUpperCase().startsWith('PAC')) {
                setResult({
                    id: trackingId.toUpperCase(),
                    status: 'In Transit',
                    origin: 'Shanghai, China',
                    destination: 'New York, USA',
                    eta: 'Oct 24, 2025',
                    events: [
                        { date: 'Oct 20, 2025', time: '14:30', status: 'Departed Facility', location: 'Shanghai Port' },
                        { date: 'Oct 19, 2025', time: '09:15', status: 'Package Received', location: 'Shanghai Warehouse' },
                        { date: 'Oct 18, 2025', time: '18:00', status: 'Shipment Created', location: 'Online' },
                    ]
                });
            } else {
                setResult(null);
                alert('Tracking ID not found (Try PAC-12345)');
            }
        }, 1500);
    };

    return (
        <PublicLayout>
            <div className="min-h-screen bg-slate-50 py-16 px-4">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <span className="text-brand-600 font-bold tracking-wide uppercase text-sm bg-brand-50 px-3 py-1 rounded-full border border-brand-100 mb-4 inline-block">Real-Time Tracking</span>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Track Your Cargo</h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">Enter your unique tracking ID to see the journey of your shipment.</p>
                </div>

                <form onSubmit={handleTrack} className="max-w-xl mx-auto mb-16 relative z-10">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-teal-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex bg-white rounded-xl shadow-xl">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition" />
                                <input
                                    type="text"
                                    placeholder="Enter Tracking ID (e.g. PAC-12345)"
                                    className="w-full pl-12 pr-4 py-5 rounded-l-xl focus:outline-none text-lg font-medium text-slate-900 placeholder:text-slate-400"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                />
                            </div>
                            <button disabled={loading} className="bg-brand-600 text-white px-8 py-4 rounded-r-xl font-bold text-lg hover:bg-brand-700 transition flex items-center gap-2">
                                {loading ? 'Scanning...' : <>Track <ArrowRight size={20} /></>}
                            </button>
                        </div>
                    </div>
                </form>

                {result && (
                    <div className="max-w-3xl mx-auto animate-fade-in-up">
                        {/* Ticket Card */}
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative">
                            {/* Decorative Top */}
                            <div className="h-3 bg-gradient-to-r from-brand-500 via-brand-600 to-teal-500"></div>

                            {/* Header */}
                            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Tracking Number</p>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">{result.id}</h2>
                                </div>
                                <div className="text-right">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                                        <Truck size={16} />
                                        {result.status}
                                    </div>
                                    <p className="text-slate-500 text-sm mt-2 font-medium">Est. Delivery: {result.eta}</p>
                                </div>
                            </div>

                            {/* Journey Map Visual */}
                            <div className="p-8 pb-0">
                                <div className="flex justify-between items-center text-slate-400 mb-4 px-4 text-xs font-bold uppercase tracking-widest">
                                    <span>Origin</span>
                                    <span>Current Status</span>
                                    <span>Destination</span>
                                </div>
                                <div className="relative flex justify-between items-center mb-12">
                                    {/* Line Background */}
                                    <div className="absolute left-0 right-0 top-1/2 h-1.5 bg-slate-100 rounded-full -z-0"></div>
                                    {/* Active Progress Line (50%) */}
                                    <div className="absolute left-0 w-1/2 top-1/2 h-1.5 bg-gradient-to-r from-brand-400 to-brand-600 rounded-full -z-0"></div>

                                    {/* Points */}
                                    <div className="z-10 bg-white p-1 rounded-full border-4 border-brand-500 shadow-lg">
                                        <div className="w-4 h-4 bg-brand-500 rounded-full"></div>
                                    </div>
                                    <div className="z-10 bg-white p-1 rounded-full border-4 border-brand-600 shadow-xl scale-125">
                                        <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white animate-pulse">
                                            <Truck size={18} />
                                        </div>
                                    </div>
                                    <div className="z-10 bg-white p-1 rounded-full border-4 border-slate-200">
                                        <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2">
                                {/* Details Column */}
                                <div className="p-8 border-r border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-6 text-lg flex items-center gap-2">
                                        <Package className="text-brand-500" /> Shipment Details
                                    </h3>
                                    <div className="space-y-4">
                                        <DetailItem label="Origin Location" value={result.origin} />
                                        <DetailItem label="Destination" value={result.destination} />
                                        <DetailItem label="Carrier" value="Pacific Logistics Global" />
                                        <DetailItem label="Total Weight" value="24.5 kg" />
                                        <DetailItem label="Service Type" value="Express Air" />
                                    </div>
                                </div>

                                {/* History Column */}
                                <div className="p-8 bg-slate-50/50">
                                    <h3 className="font-bold text-slate-900 mb-6 text-lg flex items-center gap-2">
                                        <Clock className="text-teal-500" /> Travel History
                                    </h3>
                                    <div className="space-y-6 relative border-l-2 border-slate-200 pl-6 ml-1">
                                        {result.events.map((event: any, idx: number) => (
                                            <div key={idx} className="relative">
                                                <div className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-white ring-2 ${idx === 0 ? 'bg-teal-500 ring-teal-100' : 'bg-slate-300 ring-slate-100'}`}></div>
                                                <p className={`font-bold text-sm ${idx === 0 ? 'text-slate-900' : 'text-slate-500'}`}>{event.status}</p>
                                                <p className="text-slate-500 text-xs mb-1">{event.location}</p>
                                                <div className="text-[10px] bg-white border border-slate-200 rounded-md px-2 py-1 inline-flex gap-2 text-slate-400 font-mono">
                                                    <span>{event.date}</span>
                                                    <span>{event.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Decor */}
                            <div className="bg-slate-900 p-4 text-center">
                                <p className="text-slate-500 text-xs font-mono">SECURE SHIPPING ID: {result.id}-88921</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
};

const DetailItem = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center group hover:bg-slate-50 p-2 rounded-lg transition border-b border-dashed border-slate-100 last:border-0">
        <span className="text-slate-500 text-sm">{label}</span>
        <span className="font-bold text-slate-800 text-sm">{value}</span>
    </div>
);

export default TrackPage;
