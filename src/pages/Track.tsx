
import React, { useState, useEffect } from 'react';
import PublicLayout from '../layouts/PublicLayout';
import { Search, Clock, Package, Truck, ArrowRight, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const TrackPage = () => {
    const [trackingId, setTrackingId] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [scanAnimation, setScanAnimation] = useState(false); // New state for fake scan effect

    // Map State
    const [coords, setCoords] = useState<[number, number] | null>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingId.trim()) return;

        setLoading(true);
        setScanAnimation(true);
        setResult(null);
        setCoords(null);

        // Simulate scanning delay for effect
        setTimeout(() => fetchShipmentData(), 1500);
    };

    const fetchShipmentData = async () => {
        try {
            const { data, error } = await supabase
                .from('shipments')
                .select('*')
                .eq('tracking_code', trackingId.trim())
                .single();

            if (error || !data) {
                alert('Tracking ID not found. Please check and try again.');
                setLoading(false);
                setScanAnimation(false);
                return;
            }

            // Synthesize events for now since we don't have an events table
            const events = [
                {
                    date: new Date(data.created_at).toLocaleDateString(),
                    time: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: 'Shipment Created',
                    location: 'Online System'
                }
            ];

            if (data.status !== 'Pending') {
                events.unshift({
                    date: new Date().toLocaleDateString(), // Mocking current time for update
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: data.status,
                    location: data.current_location || 'In Transit'
                });
            }

            // Geocode the current location
            if (data.current_location) {
                await geocodeLocation(data.current_location);
            } else {
                // Default to generic coords if no location (e.g. Center of Earth/Sea) - Or dont show map
                // Let's try to geocode destination if current is empty, or just null
            }

            setResult({
                id: data.tracking_code,
                status: data.status,
                origin: data.sender_address ? data.sender_address.split(',').pop()?.trim() : 'Unknown', // Rough extraction
                destination: data.destination,
                eta: data.estimated_delivery ? new Date(data.estimated_delivery).toLocaleDateString() : 'Pending',
                carrier: data.carrier || 'Pacific Logistics',
                weight: data.weight || 'N/A',
                service: data.shipment_mode || 'Standard',
                current_location: data.current_location,
                events: events
            });

        } catch (err) {
            console.error(err);
            alert('An error occurred while tracking.');
        } finally {
            setLoading(false);
            setScanAnimation(false);
        }
    };

    const geocodeLocation = async (locationName: string) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
            }
        } catch (err) {
            console.error("Geocoding failed", err);
        }
    };

    const RecenterMap = ({ coords }: { coords: [number, number] }) => {
        const map = useMap();
        useEffect(() => {
            map.setView(coords, 10);
        }, [coords]);
        return null;
    };

    return (
        <PublicLayout>
            <div className="min-h-screen bg-slate-50 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <span className="text-brand-600 font-bold tracking-wide uppercase text-sm bg-brand-50 px-3 py-1 rounded-full border border-brand-100 mb-4 inline-block">Global Tracking System</span>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Track Your Cargo</h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">Enter your unique tracking ID to see the real-time location and status of your shipment.</p>
                </div>

                <form onSubmit={handleTrack} className="max-w-xl mx-auto mb-16 relative z-20">
                    <div className="relative group">
                        <div className={`absolute -inset-1 bg-gradient-to-r from-brand-600 to-teal-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${scanAnimation ? 'animate-pulse opacity-75' : ''}`}></div>
                        <div className="relative flex bg-white rounded-xl shadow-xl overflow-hidden">
                            {scanAnimation && (
                                <div className="absolute inset-0 bg-brand-50/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                                    <div className="w-full h-1 bg-brand-500/0 animate-scan-line"></div>
                                </div>
                            )}
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition" />
                                <input
                                    type="text"
                                    placeholder="Enter Tracking ID (e.g. PCL-88219)"
                                    className="w-full pl-12 pr-4 py-5 rounded-l-xl focus:outline-none text-lg font-medium text-slate-900 placeholder:text-slate-400"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <button disabled={loading} className="bg-brand-600 text-white px-8 py-4 rounded-r-xl font-bold text-lg hover:bg-brand-700 transition flex items-center gap-2 relative z-20">
                                {loading ? 'Locating...' : <>Track <ArrowRight size={20} /></>}
                            </button>
                        </div>
                    </div>
                </form>

                {result && (
                    <div className="max-w-5xl mx-auto animate-fade-in-up space-y-8">

                        {/* Status Overview Card */}
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">{result.id}</h2>
                                        <div className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded">SECURE</div>
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium">Carrier: {result.carrier}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shadow-sm ${result.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                            result.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        <Truck size={18} />
                                        {result.status}
                                    </div>
                                    <p className="text-slate-400 text-xs mt-2 font-mono">EST: {result.eta}</p>
                                </div>
                            </div>

                            {/* Map Section */}
                            <div className="h-[400px] w-full bg-slate-100 relative z-0">
                                {coords ? (
                                    <MapContainer center={coords} zoom={5} scrollWheelZoom={false} className="h-full w-full z-0">
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker position={coords}>
                                            <Popup>
                                                <b>Current Location</b><br /> {result.current_location}
                                            </Popup>
                                        </Marker>
                                        <RecenterMap coords={coords} />
                                    </MapContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                        <MapPin size={48} className="mb-4 opacity-50" />
                                        <p>Map location unavailable for this status.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Left: Journey Info */}
                            <div className="md:col-span-2 bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-6 text-lg flex items-center gap-2">
                                    <Clock className="text-teal-500" /> Journey History
                                </h3>
                                <div className="space-y-8 relative border-l-2 border-slate-200 pl-8 ml-3">
                                    {result.events.map((event: any, idx: number) => (
                                        <div key={idx} className="relative">
                                            <div className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ring-1 ${idx === 0 ? 'bg-teal-500 ring-teal-200' : 'bg-slate-300 ring-slate-200'}`}></div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                                <div>
                                                    <p className={`font-bold text-base ${idx === 0 ? 'text-slate-900' : 'text-slate-500'}`}>{event.status}</p>
                                                    <p className="text-slate-500 text-sm">{event.location}</p>
                                                </div>
                                                <div className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded self-start">
                                                    {event.date} • {event.time}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Package Specs */}
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 h-fit">
                                <h3 className="font-bold text-slate-900 mb-6 text-lg flex items-center gap-2">
                                    <Package className="text-brand-500" /> Package Specs
                                </h3>
                                <div className="space-y-4">
                                    <DetailItem label="Origin" value={result.origin} />
                                    <DetailItem label="Destination" value={result.destination} />
                                    <DetailItem label="Weight" value={`${result.weight} kg`} />
                                    <DetailItem label="Service" value={result.service} />
                                    <DetailItem label="Type" value="Package/Parcel" />
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <button className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition">
                                        Print Waybill
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
};

const DetailItem = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 border-dashed">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        <span className="font-bold text-slate-700 text-sm text-right truncate max-w-[150px]">{value}</span>
    </div>
);

export default TrackPage;
