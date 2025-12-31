
import React, { useState, useEffect } from 'react';
import PublicLayout from '../layouts/PublicLayout';
import { Search, MapPin, Package, Clock, Download, LayoutDashboard, Truck, ArrowRight, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import Toast, { ToastType } from '../components/Toast';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
    const [scanAnimation, setScanAnimation] = useState(false);
    const [coords, setCoords] = useState<[number, number] | null>(null);
    const [user, setUser] = useState<any>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type });
    };

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
            setTrackingId(code);
            setLoading(true);
            setScanAnimation(true);
            setTimeout(() => fetchShipmentData(code), 1000);
        }
    }, []);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingId.trim()) return;

        setLoading(true);
        setScanAnimation(true);
        setResult(null);
        setCoords(null);
        setTimeout(() => fetchShipmentData(), 1500);
    };

    const fetchShipmentData = async (manualId?: string) => {
        const idToSearch = manualId || trackingId;
        if (!idToSearch.trim()) return;

        try {
            const { data, error } = await supabase
                .from('shipments')
                .select('*')
                .eq('tracking_code', idToSearch.trim())
                .single();

            if (error || !data) {
                showToast('Tracking ID not found. Please check and try again.', 'error');
                setLoading(false);
                setScanAnimation(false);
                return;
            }

            const { data: dbEvents } = await supabase
                .from('shipment_events')
                .select('*')
                .eq('shipment_id', data.id)
                .order('created_at', { ascending: false });

            const events = dbEvents?.map(event => ({
                date: new Date(event.created_at).toLocaleDateString(),
                time: new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: event.status,
                location: event.location || 'In Transit',
                description: event.description
            })) || [
                    {
                        date: new Date(data.created_at).toLocaleDateString(),
                        time: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        status: 'Shipment Created',
                        location: 'System'
                    }
                ];

            // Determine location to plot
            let locationToPlot = data.current_location;
            if (data.status === 'Delivered') {
                locationToPlot = data.destination;
            }

            if (locationToPlot) {
                await geocodeLocation(locationToPlot);
            }

            setResult({
                id: data.tracking_code,
                status: data.status,
                origin: data.sender_address ? data.sender_address.split(',').pop()?.trim() : 'Unknown',
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
            showToast('An error occurred while tracking.', 'error');
        } finally {
            setLoading(false);
            setScanAnimation(false);
        }
    };

    const geocodeLocation = async (locationName: string) => {
        try {
            // Attempt 1: Full location string
            let response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`);
            let data = await response.json();

            // Attempt 2: If failed, and has comma, try first part (City)
            if ((!data || data.length === 0) && locationName.includes(',')) {
                const cityOnly = locationName.split(',')[0].trim();
                console.log(`Geocoding retry with city: ${cityOnly}`);
                response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityOnly)}`);
                data = await response.json();
            }

            if (data && data.length > 0) {
                setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
            } else {
                // Final Fallback: if still nothing, try Origin? 
                // For now, let's just log it.
                console.warn("Geocoding failed for all attempts");
            }
        } catch (err) {
            console.error("Geocoding failed", err);
        }
    };

    const handleDownloadPDF = async () => {
        if (!result) return;
        const input = document.getElementById('waybill-content');
        if (!input) return;

        try {
            setToast({ message: 'Synthesizing PDF Waybill...', type: 'info' });
            const canvas = await (html2canvas as any)(input, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Waybill-${result.id}.pdf`);
            showToast('Waybill downloaded!');
        } catch (err) {
            console.error("PDF generation failed", err);
            showToast("Failed to generate PDF", 'error');
        }
    };

    return (
        <PublicLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="min-h-screen bg-slate-50 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    {user && (
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 text-brand-600 font-bold hover:text-brand-700 transition mb-6 px-4 py-2 bg-brand-50 rounded-full border border-brand-100"
                        >
                            <LayoutDashboard size={18} />
                            Back to My Dashboard
                        </Link>
                    )}
                    <br />
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
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{result.id}</h2>
                                            <div className="bg-brand-600 text-white text-[10px] font-black px-2 py-1 rounded tracking-widest uppercase">Certified</div>
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                                            <Package size={14} className="text-brand-500" />
                                            {result.carrier} • {result.service}
                                        </p>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <div className={clsx(
                                            "inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm",
                                            result.status === 'Delivered' ? 'bg-emerald-500 text-white' :
                                                result.status === 'In Transit' ? 'bg-brand-600 text-white' :
                                                    'bg-slate-900 text-white'
                                        )}>
                                            <Truck size={16} />
                                            {result.status}
                                        </div>
                                        <p className="text-slate-400 text-[10px] mt-2 font-black uppercase tracking-widest">Est. Delivery: {result.eta}</p>
                                    </div>
                                </div>

                                <div className="relative pt-4 pb-8">
                                    <div className="flex justify-between relative z-10">
                                        {[
                                            { label: 'Booking', status: 'Pending', icon: Package },
                                            { label: 'In Transit', status: 'In Transit', icon: Truck },
                                            { label: 'Out for Delivery', status: 'Out for Delivery', icon: MapPin },
                                            { label: 'Delivered', status: 'Delivered', icon: CheckCircle }
                                        ].map((step, idx, arr) => {
                                            const stepOrder = ['Pending', 'In Transit', 'Out for Delivery', 'Delivered'];
                                            const currentIdx = stepOrder.indexOf(result.status);
                                            const isPast = idx <= (currentIdx === -1 ? 0 : currentIdx);
                                            const isCurrent = idx === currentIdx;

                                            return (
                                                <div key={idx} className="flex flex-col items-center flex-1 group">
                                                    <div className={clsx(
                                                        "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500",
                                                        isPast ? "bg-brand-600 border-brand-100 text-white" : "bg-white border-slate-100 text-slate-300"
                                                    )}>
                                                        <step.icon size={18} className={isCurrent ? "animate-bounce" : ""} />
                                                    </div>
                                                    <div className="mt-3 text-center">
                                                        <p className={clsx(
                                                            "text-[10px] font-black uppercase tracking-widest leading-none",
                                                            isPast ? "text-slate-900" : "text-slate-400"
                                                        )}>{step.label}</p>
                                                    </div>
                                                    {idx < arr.length - 1 && (
                                                        <div className="absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-1 -z-10 bg-slate-100">
                                                            <div
                                                                className="h-full bg-brand-600 transition-all duration-1000"
                                                                style={{ width: isPast && idx < currentIdx ? '100%' : '0%' }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="h-[400px] w-full bg-slate-100 relative z-0">
                                {coords ? (
                                    <MapContainer center={coords} zoom={5} scrollWheelZoom={false} className="h-full w-full z-0 border-t border-slate-100">
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker position={coords}>
                                            <Popup className="custom-popup">
                                                <div className="p-1">
                                                    <p className="font-bold text-slate-900 mb-1">Current Cargo Status</p>
                                                    <p className="text-xs text-slate-500">{result.current_location}</p>
                                                </div>
                                            </Popup>
                                        </Marker>
                                        <RecenterMap coords={coords} />
                                    </MapContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-brand-500 rounded-full blur-2xl opacity-10 animate-pulse"></div>
                                            <MapPin size={64} className="mb-4 opacity-20 relative z-10" />
                                        </div>
                                        <p className="font-bold text-slate-300 tracking-tight">Real-time coordinates pending update</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="font-extrabold text-slate-900 text-xl tracking-tight flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <Clock size={20} />
                                        </div>
                                        Detailed Journey
                                    </h3>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Real-time Feed
                                    </div>
                                </div>

                                <div className="space-y-10 relative">
                                    <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

                                    {result.events.map((event: any, idx: number) => (
                                        <div key={idx} className="relative pl-12 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                            <div className={clsx(
                                                "absolute left-0 top-1 w-10 h-10 rounded-xl flex items-center justify-center border-4 border-white shadow-sm z-10 transition-colors duration-500",
                                                idx === 0 ? "bg-brand-600 shadow-brand-100" : "bg-slate-100"
                                            )}>
                                                {idx === 0 ? <Package size={16} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-slate-400" />}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                                                    <p className={clsx(
                                                        "font-black text-lg tracking-tight",
                                                        idx === 0 ? "text-slate-900" : "text-slate-500"
                                                    )}>{event.status}</p>
                                                    <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 self-start">
                                                        {event.date} • {event.time}
                                                    </div>
                                                </div>
                                                <p className="text-slate-500 text-sm font-medium mt-1 flex items-center gap-2">
                                                    <MapPin size={14} className="text-slate-300" />
                                                    {event.location}
                                                </p>
                                                {event.description && (
                                                    <p className="mt-3 text-sm text-slate-400 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-50 italic">
                                                        "{event.description}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

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
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2"
                                    >
                                        <Download size={18} /> Download Waybill (PDF)
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-0 left-[-9999px] w-[210mm] bg-white p-[20mm] text-slate-900" id="waybill-content">
                            <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-slate-100">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Pacific Cargo</h1>
                                    <p className="text-slate-500 text-sm">Global Logistics & Freight Solutions</p>
                                </div>
                                <div className="text-right">
                                    <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">
                                        {result?.status?.toUpperCase()}
                                    </span>
                                    <div className="font-mono text-xl font-bold">{result?.id}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-12 mb-12">
                                <div>
                                    <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 border-b border-slate-100 pb-2">Origin</h3>
                                    <div className="space-y-1">
                                        <p className="font-bold text-lg">{result?.origin}</p>
                                        <p className="text-slate-500 text-sm">Sender details on file</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 border-b border-slate-100 pb-2">Destination</h3>
                                    <div className="space-y-1">
                                        <p className="font-bold text-lg">{result?.destination}</p>
                                        <p className="text-slate-500 text-sm">ETA: {result?.eta}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-12">
                                <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 border-b border-slate-100 pb-2">Shipment Details</h3>
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500">
                                        <tr>
                                            <th className="p-3">Item Description</th>
                                            <th className="p-3">Weight</th>
                                            <th className="p-3">Service</th>
                                            <th className="p-3">Carrier</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="p-3 font-medium">Logistics Package / Cargo</td>
                                            <td className="p-3">{result?.weight} kg</td>
                                            <td className="p-3">{result?.service}</td>
                                            <td className="p-3">{result?.carrier}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl mb-12">
                                <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Detailed Tracking</h3>
                                <div className="font-mono text-sm">Current Location: <span className="font-bold text-slate-900">{result?.current_location || 'Processing'}</span></div>
                            </div>

                            <div className="text-center text-xs text-slate-400 border-t border-slate-100 pt-8">
                                <p>This document is an official receipt of shipment generated by Pacific Cargo Logistics Systems.</p>
                                <p className="mt-1">&copy; {new Date().getFullYear()} Pacific Cargo. All rights reserved.</p>
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

const RecenterMap = ({ coords }: { coords: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(coords, 10);
    }, [coords]);
    return null;
};

export default TrackPage;
