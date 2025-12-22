
import React, { useState } from 'react';
import PublicLayout from '../layouts/PublicLayout';
import { Search, MapPin, Calendar, Clock, Package, CheckCircle2, Truck } from 'lucide-react';

const TrackPage = () => {
    const [trackingId, setTrackingId] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
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
            <div className="bg-slate-50 py-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Track Your Shipment</h1>
                    <p className="text-slate-600 mb-8">Enter your tracking number below to see the current status of your delivery.</p>

                    <form onSubmit={handleTrack} className="flex gap-2 max-w-xl mx-auto mb-12">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Enter Tracking ID (e.g. PAC-12345)"
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                            />
                            <Search className="absolute left-4 top-4 text-slate-400" />
                        </div>
                        <button disabled={loading} className="bg-brand-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-200">
                            {loading ? 'Tracking...' : 'Track'}
                        </button>
                    </form>
                </div>
            </div>

            {result && (
                <div className="max-w-4xl mx-auto px-4 py-12">
                    {/* Status Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-8">
                        <div className="bg-brand-600 p-6 text-white flex justify-between items-center">
                            <div>
                                <p className="text-brand-100 text-sm font-medium uppercase tracking-wider">Tracking ID</p>
                                <h2 className="text-3xl font-bold">{result.id}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-brand-100 text-sm font-medium">Estimated Delivery</p>
                                <p className="text-xl font-bold">{result.eta}</p>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                                <StatusPoint icon={Package} label="Picked Up" active />
                                <Connector active />
                                <StatusPoint icon={Truck} label="In Transit" active />
                                <Connector active={false} />
                                <StatusPoint icon={MapPin} label="Arrived" active={false} />
                                <Connector active={false} />
                                <StatusPoint icon={CheckCircle2} label="Delivered" active={false} />
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4 text-lg">Shipment Details</h3>
                                    <div className="space-y-4">
                                        <DetailRow label="Origin" value={result.origin} />
                                        <DetailRow label="Destination" value={result.destination} />
                                        <DetailRow label="Service Type" value="Express Air Freight" />
                                        <DetailRow label="Weight" value="12.5 kg" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4 text-lg">Travel History</h3>
                                    <div className="space-y-6 border-l-2 border-slate-100 pl-6 relative">
                                        {result.events.map((event: any, idx: number) => (
                                            <div key={idx} className="relative">
                                                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-brand-500 border-2 border-white ring-2 ring-slate-100"></div>
                                                <p className="font-bold text-slate-900">{event.status}</p>
                                                <p className="text-slate-500 text-sm">{event.location}</p>
                                                <div className="text-xs text-slate-400 mt-1 flex gap-2">
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
};

const StatusPoint = ({ icon: Icon, label, active }: any) => (
    <div className={`flex flex-col items-center ${active ? 'text-brand-600' : 'text-slate-300'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${active ? 'bg-brand-50' : 'bg-slate-50'}`}>
            <Icon size={24} />
        </div>
        <span className="font-bold text-sm">{label}</span>
    </div>
);

const Connector = ({ active }: { active: boolean }) => (
    <div className={`h-1 flex-1 hidden md:block rounded-full ${active ? 'bg-brand-200' : 'bg-slate-100'}`}></div>
);

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between py-3 border-b border-slate-50">
        <span className="text-slate-500">{label}</span>
        <span className="font-bold text-slate-900">{value}</span>
    </div>
);

export default TrackPage;
