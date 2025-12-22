
import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Package, Truck, CheckCircle2, Wallet } from 'lucide-react';

const Dashboard = () => {
    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome Back, Admin!</h1>
                    <p className="text-slate-500">Your logistics dashboard at a glance</p>
                </div>
                <button className="bg-brand-600 text-white px-6 py-2.5 rounded-lg hover:bg-brand-700 transition font-medium flex items-center gap-2">
                    <Wallet size={18} />
                    Fund Wallet
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Wallet Balance"
                    value="₦0.00"
                    icon={<Wallet className="text-brand-600" size={24} />}
                    bg="bg-blue-50"
                />
                <StatsCard
                    title="Total Shipments"
                    value="12"
                    icon={<Package className="text-orange-600" size={24} />}
                    bg="bg-orange-50"
                />
                <StatsCard
                    title="In Transit"
                    value="4"
                    icon={<Truck className="text-indigo-600" size={24} />}
                    bg="bg-indigo-50"
                />
                <StatsCard
                    title="Delivered"
                    value="8"
                    icon={<CheckCircle2 className="text-emerald-600" size={24} />}
                    bg="bg-emerald-50"
                />
            </div>

            {/* Recent Shipments Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Recent Shipments</h2>
                    <button className="text-brand-600 text-sm font-medium hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Tracking ID</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Destination</th>
                                <th className="px-6 py-4 font-semibold">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <ShipmentRow id="PAC-8842" status="In Transit" dest="New York, USA" date="2 mins ago" />
                            <ShipmentRow id="PAC-9921" status="Delivered" dest="London, UK" date="1 day ago" />
                            <ShipmentRow id="PAC-1234" status="Pending" dest="Lagos, Nigeria" date="3 hours ago" />
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

const StatsCard = ({ title, value, icon, bg }: { title: string, value: string, icon: React.ReactNode, bg: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`p-4 rounded-full ${bg}`}>
            {icon}
        </div>
    </div>
);

const ShipmentRow = ({ id, status, dest, date }: { id: string, status: string, dest: string, date: string }) => {
    const getStatusColor = (s: string) => {
        if (s === 'In Transit') return 'bg-blue-100 text-blue-700';
        if (s === 'Delivered') return 'bg-emerald-100 text-emerald-700';
        return 'bg-amber-100 text-amber-700';
    };

    return (
        <tr className="hover:bg-slate-50 transition">
            <td className="px-6 py-4 text-sm font-medium text-slate-900">{id}</td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                    {status}
                </span>
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">{dest}</td>
            <td className="px-6 py-4 text-sm text-slate-400">{date}</td>
        </tr>
    );
}

export default Dashboard;
