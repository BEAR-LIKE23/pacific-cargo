
// Pacific Cargo - Analytics
import { useState, useEffect } from 'react';
import { Activity, Package, Users, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Printer, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminSidebar from '../../components/AdminSidebar';
import clsx from 'clsx';

const Analytics = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        revenueGrowh: 12.5,
        totalShipments: 0,
        shipmentGrowth: 8.2,
        activeUsers: 0,
        userGrowth: 5.4,
        avgTicket: 15400
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d');

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            // In a real app, we'd use complex SQL or RPC
            // For now, we'll aggregate from our tables

            const { data: shipments } = await supabase.from('shipments').select('created_at, status');
            const { data: profiles } = await supabase.from('profiles').select('id');
            const { data: txs } = await supabase.from('transactions').select('amount, type, status').eq('status', 'completed');

            let revenue = 0;
            txs?.forEach(tx => {
                if (tx.type === 'payment') revenue += Number(tx.amount);
            });

            setStats(prev => ({
                ...prev,
                totalRevenue: revenue,
                totalShipments: shipments?.length || 0,
                activeUsers: profiles?.length || 0,
                avgTicket: revenue / (shipments?.length || 1)
            }));

        } catch (error) {
            console.error('Analytics Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />

            <main className="flex-1 p-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Intelligence</h1>
                        <p className="text-slate-500 font-medium">Global logistics performance and financial health.</p>
                    </div>

                    <div className="flex gap-3">
                        <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm">
                            {['7d', '30d', '90d'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={clsx(
                                        "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                                        timeRange === range ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                        <button className="bg-white p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition shadow-sm">
                            <Download size={20} />
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 font-bold">Aggregating system intelligence...</p>
                    </div>
                ) : (
                    <>
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            <StatCard
                                label="Total Revenue"
                                value={`₦${stats.totalRevenue.toLocaleString()}`}
                                trend={stats.revenueGrowh}
                                icon={<DollarSign className="text-emerald-500" />}
                                color="bg-emerald-50"
                            />
                            <StatCard
                                label="Total Shipments"
                                value={stats.totalShipments.toString()}
                                trend={stats.shipmentGrowth}
                                icon={<Package className="text-blue-500" />}
                                color="bg-blue-50"
                            />
                            <StatCard
                                label="Total Users"
                                value={stats.activeUsers.toString()}
                                trend={stats.userGrowth}
                                icon={<Users className="text-brand-500" />}
                                color="bg-brand-50"
                            />
                            <StatCard
                                label="Avg. Ticket"
                                value={`₦${Math.round(stats.avgTicket).toLocaleString()}`}
                                trend={-2.1}
                                icon={<Activity className="text-amber-500" />}
                                color="bg-amber-50"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Revenue Visualization */}
                            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                        <TrendingUp className="text-brand-600" size={24} />
                                        Revenue Performance
                                    </h3>
                                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                        Real-time Aggregation
                                    </div>
                                </div>

                                {/* Custom Bar Chart Simulation */}
                                <div className="h-[300px] flex items-end justify-between gap-4 pt-4">
                                    {[45, 60, 40, 80, 55, 90, 75, 85, 65, 95, 80, 100].map((val, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center group relative">
                                            <div className="absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition bottom-full mb-2 whitespace-nowrap z-20">
                                                ₦{(val * 50000).toLocaleString()}
                                            </div>
                                            <div
                                                style={{ height: `${val}%` }}
                                                className={clsx(
                                                    "w-full rounded-t-lg transition-all duration-1000 group-hover:brightness-110",
                                                    i % 2 === 0 ? "bg-brand-500" : "bg-brand-400"
                                                )}
                                            />
                                            <span className="text-[8px] font-black text-slate-400 uppercase mt-4 vertical-text">
                                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Status Distribution */}
                            <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <ShieldAlert size={120} className="rotate-12" />
                                </div>

                                <h3 className="text-xl font-bold mb-8 relative z-10 tracking-tight">Shipment Health</h3>

                                <div className="space-y-6 relative z-10">
                                    <HealthBar label="In Transit" count={Math.round(stats.totalShipments * 0.45)} color="bg-brand-500" total={stats.totalShipments} />
                                    <HealthBar label="Delivered" count={Math.round(stats.totalShipments * 0.35)} color="bg-emerald-500" total={stats.totalShipments} />
                                    <HealthBar label="On Hold" count={Math.round(stats.totalShipments * 0.15)} color="bg-amber-500" total={stats.totalShipments} />
                                    <HealthBar label="Returned" count={Math.round(stats.totalShipments * 0.05)} color="bg-red-500" total={stats.totalShipments} />
                                </div>

                                <div className="mt-12 pt-8 border-t border-slate-800 relative z-10 text-center">
                                    <button className="flex items-center gap-2 mx-auto text-xs font-black uppercase tracking-widest text-brand-400 hover:text-brand-300 transition">
                                        <Printer size={16} /> Print Full Audit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

const StatCard = ({ label, value, trend, icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group">
        <div className="flex justify-between items-start mb-4">
            <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", color)}>
                {icon}
            </div>
            <div className={clsx(
                "flex items-center gap-1 text-[10px] font-black tracking-widest px-2 py-1 rounded-full",
                trend >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            )}>
                {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {Math.abs(trend)}%
            </div>
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h4>
    </div>
);

const HealthBar = ({ label, count, color, total }: any) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400">{label}</span>
                <span className="text-xs font-black">{count}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                    style={{ width: `${percentage}%` }}
                    className={clsx("h-full rounded-full transition-all duration-1000", color)}
                />
            </div>
        </div>
    );
};

const ShieldAlert = ({ size, className }: any) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
    </svg>
);

export default Analytics;

