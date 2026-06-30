import { useEffect, useState } from 'react';
import UserLayout from '../../layouts/UserLayout';
import { Plus, ArrowUpRight, Search, Bell, Package, Truck, CheckCircle2, Wallet, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Toast, { ToastType } from '../../components/Toast';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [shipments, setShipments] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    useEffect(() => {
        let subscription: any;

        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    navigate('/login');
                    return;
                }

                // Fetch Profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile(profileData);

                // Fetch Shipments
                const { data: shipmentsData } = await supabase
                    .from('shipments')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                setShipments(shipmentsData || []);

                // Fetch Notifications
                const { data: notifsData } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5);
                setNotifications(notifsData || []);

                // Subscribe to Realtime Updates (Shipments & Notifications)
                const shipmentsSubscription = supabase
                    .channel('user_updates')
                    .on('postgres_changes', {
                        event: '*',
                        schema: 'public',
                        table: 'shipments',
                        filter: `user_id=eq.${user.id}`
                    }, (payload) => {
                        if (payload.eventType === 'INSERT') {
                            setShipments(prev => [payload.new, ...prev]);
                            setToast({ message: 'New shipment added!', type: 'success' });
                        } else if (payload.eventType === 'UPDATE') {
                            setShipments(prev => prev.map(s => s.id === payload.new.id ? payload.new : s));
                            setToast({ message: `Shipment ${payload.new.tracking_code} updated to ${payload.new.status}`, type: 'info' });
                        }
                    })
                    .on('postgres_changes', {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`
                    }, (payload) => {
                        setNotifications(prev => [payload.new, ...prev.slice(0, 4)]);
                        setToast({ message: `New Notification: ${payload.new.title}`, type: 'info' });
                    })
                    .subscribe();

                subscription = shipmentsSubscription;

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            if (subscription) supabase.removeChannel(subscription);
        };
    }, [navigate]);

    const filteredShipments = shipments.filter(s =>
        s.tracking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.receiver_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeShipments = shipments.filter(s => s.status === 'In Transit' || s.status === 'Pending').length;
    const deliveredShipments = shipments.filter(s => s.status === 'Delivered').length;

    return (
        <UserLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            {/* Header */}
            <div className="relative z-50 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 animate-fade-in-up">
                <div>
                    <div className="inline-block px-3 py-1 bg-brand-50 border border-brand-100 text-brand-600 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
                        Overview
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">My Dashboard</h1>
                    <p className="text-slate-500 font-medium">Welcome back, <span className="text-slate-900 font-bold">{profile?.full_name || 'User'}</span>. Manage your shipments and wallet here.</p>
                </div>
                <div className="flex items-center justify-end w-full md:w-auto gap-4 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-500 hover:text-brand-600 hover:border-brand-200 transition-all relative group"
                        >
                            <Bell size={20} className="group-hover:animate-bounce" />
                            {notifications.some(n => !n.is_read) && (
                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-4 w-[90vw] md:w-96 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5 z-50 overflow-hidden animate-fade-in-up">
                                <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900">Notifications</h3>
                                    <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">New Updates</span>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-10 text-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Bell className="text-slate-300" size={32} />
                                            </div>
                                            <p className="text-slate-500 font-medium">No notifications yet</p>
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div key={n.id} className="p-5 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition">{n.title}</h4>
                                                    <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100">{new Date(n.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{n.message}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-4 bg-slate-50 text-center border-t border-slate-100 hover:bg-slate-100 transition cursor-pointer">
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">View All Activity</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/wallet')}
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all font-bold flex items-center gap-2 shadow-xl shadow-slate-900/10 group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                        Fund Wallet
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatsCard
                    title="Wallet Balance"
                    value={`₦${profile?.balance?.toLocaleString() || '0.00'}`}
                    icon={<Wallet className="text-white" size={24} strokeWidth={1.5} />}
                    gradient="bg-gradient-to-br from-brand-600 to-brand-700"
                    trend="+Fund"
                    delay="100ms"
                />
                <StatsCard
                    title="My Shipments"
                    value={shipments.length}
                    icon={<Truck className="text-brand-600" size={24} strokeWidth={1.5} />}
                    bg="bg-white"
                    trend="Total"
                    delay="200ms"
                />
                <StatsCard
                    title="Delivered"
                    value={deliveredShipments}
                    icon={<CheckCircle2 className="text-emerald-500" size={24} strokeWidth={1.5} />}
                    bg="bg-white"
                    trend="Completed"
                    delay="300ms"
                />
                <StatsCard
                    title="Active"
                    value={activeShipments}
                    icon={<Package className="text-orange-500" size={24} strokeWidth={1.5} />}
                    bg="bg-white"
                    trend="In Progress"
                    delay="400ms"
                />
            </div>

            {/* Cost Banner - CTA */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 flex items-center justify-center border border-brand-200 shadow-sm">
                        <span className="font-black text-2xl tracking-tighter">₦</span>
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Standard Tracking Cost</p>
                        <h3 className="text-3xl font-black text-slate-900">₦10,000.00</h3>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/dashboard/create-shipment')}
                    className="bg-brand-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-brand-700 transition-all flex items-center gap-2 shadow-lg shadow-brand-600/30 group w-full md:w-auto justify-center"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Create Shipment
                </button>
            </div>

            {/* Recent Shipments Table */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900">My Recent Shipments</h2>
                        <p className="text-slate-500 font-medium mt-1">Track and manage your active orders.</p>
                    </div>
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search tracking ID or receiver..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none w-full md:w-80 transition-all shadow-sm"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-6">Tracking ID</th>
                                <th className="px-8 py-6">Receiver</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6">Destination</th>
                                <th className="px-8 py-6">Date</th>
                                <th className="px-8 py-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16">
                                        <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin"></div>
                                        <p className="mt-4 text-slate-500 font-medium">Loading shipments...</p>
                                    </td>
                                </tr>
                            ) : filteredShipments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-slate-500">
                                        <Package className="mx-auto text-slate-300 mb-4" size={48} />
                                        <p className="text-lg font-medium text-slate-900 mb-1">No shipments found</p>
                                        <p className="text-sm text-slate-500">{searchQuery ? 'Try a different search term.' : 'Create your first shipment to get started!'}</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredShipments.map((item: any) => (
                                    <ShipmentRow
                                        key={item.id}
                                        id={item.tracking_code}
                                        customer={item.receiver_name}
                                        status={item.status}
                                        dest={item.destination}
                                        date={new Date(item.created_at).toLocaleDateString()}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </UserLayout>
    );
};

const StatsCard = ({ title, value, icon, gradient, trend, delay }: any) => (
    <div 
        className={`p-8 rounded-[2rem] shadow-lg border relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 animate-fade-in-up ${gradient ? 'bg-gradient-to-br border-transparent shadow-brand-900/20 ' + gradient : 'bg-white border-slate-100 shadow-slate-200/50'}`}
        style={{ animationDelay: delay }}
    >
        {gradient && <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>}

        <div className="flex justify-between items-start mb-6 relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${gradient ? 'bg-white/20 backdrop-blur-md border border-white/20' : 'bg-slate-50 border border-slate-100'}`}>
                {icon}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm ${gradient ? 'bg-white/20 text-white backdrop-blur-md border border-white/20' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                {trend} <ArrowUpRight size={12} strokeWidth={3} />
            </span>
        </div>

        <div className="relative z-10">
            <h3 className={`text-3xl font-black mb-1 tracking-tight ${gradient ? 'text-white' : 'text-slate-900'}`}>{value}</h3>
            <p className={`text-sm font-bold ${gradient ? 'text-white/80' : 'text-slate-500'}`}>{title}</p>
        </div>
    </div>
);

const ShipmentRow = ({ id, customer, status, dest, date }: any) => {
    const getStatusStyle = (s: string) => {
        if (s === 'In Transit') return 'bg-brand-50 text-brand-600 border-brand-100';
        if (s === 'Delivered') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        return 'bg-amber-50 text-amber-600 border-amber-100';
    };

    return (
        <tr className="hover:bg-slate-50 transition-colors group cursor-pointer border-b border-slate-50 last:border-0">
            <td className="px-8 py-6">
                <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">{id}</span>
            </td>
            <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                        {customer.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{customer}</span>
                </div>
            </td>
            <td className="px-8 py-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(status)}`}>
                    {status}
                </span>
            </td>
            <td className="px-8 py-6 text-sm font-medium text-slate-500">{dest}</td>
            <td className="px-8 py-6 text-sm font-medium text-slate-400">{date}</td>
            <td className="px-8 py-6 text-right">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/track?code=${id}`;
                    }}
                    className="text-brand-600 hover:text-white hover:bg-brand-600 px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-end gap-2 ml-auto border border-brand-100 hover:border-brand-600"
                >
                    <Eye size={16} /> Track
                </button>
            </td>
        </tr>
    );
}

export default UserDashboard;
