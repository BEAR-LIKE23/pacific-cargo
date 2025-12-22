

import AdminLayout from '../../layouts/AdminLayout';
import { Package, Truck, CheckCircle2, Wallet, Plus, ArrowUpRight, Search, Bell } from 'lucide-react';

const Dashboard = () => {
    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard overview</h1>
                    <p className="text-slate-500 font-medium">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-500 hover:text-brand-600 transition relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <button className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition font-bold flex items-center gap-2 shadow-lg shadow-slate-900/20">
                        <Plus size={18} />
                        New Shipment
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatsCard
                    title="Total Revenue"
                    value="₦4,250,000"
                    icon={<Wallet className="text-white" size={24} />}
                    gradient="bg-gradient-to-br from-blue-600 to-blue-700"
                    trend="+12.5%"
                />
                <StatsCard
                    title="Active Shipments"
                    value="124"
                    icon={<Truck className="text-blue-600" size={24} />}
                    bg="bg-white"
                    trend="+4"
                />
                <StatsCard
                    title="Delivered"
                    value="1,892"
                    icon={<CheckCircle2 className="text-emerald-500" size={24} />}
                    bg="bg-white"
                    trend="+18"
                />
                <StatsCard
                    title="Pending"
                    value="12"
                    icon={<Package className="text-orange-500" size={24} />}
                    bg="bg-white"
                    trend="-2"
                />
            </div>

            {/* Recent Shipments Table */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-slate-900">Recent Shipments</h2>
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
                                <th className="px-8 py-5">Customer</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Destination</th>
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <ShipmentRow
                                    key={i}
                                    id={`PAC-884${2 + i}`}
                                    customer={["John Doe", "Sarah Smith", "Mike Ross", "Harvey S.", "Louis L."][i]}
                                    status={["In Transit", "Delivered", "Pending", "In Transit", "Delivered"][i]}
                                    dest={["New York, USA", "London, UK", "Lagos, NG", "Tokyo, JP", "Paris, FR"][i]}
                                    date="Oct 24, 2025"
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

const StatsCard = ({ title, value, icon, bg, gradient, trend }: any) => (
    <div className={`p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition duration-300 ${gradient || bg}`}>
        {gradient && <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>}

        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gradient ? 'bg-white/20 backdrop-blur-md' : 'bg-slate-50'}`}>
                {icon}
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${gradient ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                {trend} <ArrowUpRight size={12} />
            </span>
        </div>

        <div className="relative z-10">
            <h3 className={`text-2xl font-black mb-1 ${gradient ? 'text-white' : 'text-slate-900'}`}>{value}</h3>
            <p className={`text-sm font-medium ${gradient ? 'text-blue-100' : 'text-slate-500'}`}>{title}</p>
        </div>
    </div>
);

const ShipmentRow = ({ id, customer, status, dest, date }: any) => {
    const getStatusStyle = (s: string) => {
        if (s === 'In Transit') return 'bg-blue-50 text-blue-600 border-blue-100';
        if (s === 'Delivered') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        return 'bg-amber-50 text-amber-600 border-amber-100';
    };

    return (
        <tr className="hover:bg-slate-50/80 transition group cursor-pointer">
            <td className="px-8 py-5 text-sm font-bold text-slate-900">{id}</td>
            <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                        {customer.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{customer}</span>
                </div>
            </td>
            <td className="px-8 py-5">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(status)}`}>
                    {status}
                </span>
            </td>
            <td className="px-8 py-5 text-sm text-slate-500">{dest}</td>
            <td className="px-8 py-5 text-sm text-slate-500">{date}</td>
            <td className="px-8 py-5 text-right">
                <button className="text-brand-600 hover:text-brand-700 font-medium text-sm">Manage</button>
            </td>
        </tr>
    );
}

export default Dashboard;
