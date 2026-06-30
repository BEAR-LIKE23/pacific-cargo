import { useEffect, useState } from 'react';
import { Package, Users, Activity, CheckCircle, XCircle, Clock, FileText, ArrowUpRight, ShieldCheck } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Toast, { ToastType } from '../../components/Toast';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ users: 0, shipments: 0, revenue: 0 });
    const [transactions, setTransactions] = useState<any[]>([]);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    useEffect(() => {
        fetchAdminData();
    }, [navigate]);

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type });
    };

    const fetchAdminData = async () => {
        try {
            // Verify Admin Access
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/admin/login');
                return;
            }

            // Double check role
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
            if (profile?.role !== 'super_admin') {
                navigate('/login');
                return;
            }

            // 1. Get Stats (Approximate)
            const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: shipmentCount } = await supabase.from('shipments').select('*', { count: 'exact', head: true });

            // 2. Get Transactions (Pending first)
            const { data: txs } = await supabase
                .from('transactions')
                .select('*, profiles(full_name, email)')
                .order('created_at', { ascending: false })
                .limit(20);

            // Calculate Revenue (Sum of completed deposits)
            const { data: revenueData } = await supabase.from('transactions').select('amount').eq('status', 'completed').eq('type', 'deposit');
            const totalRevenue = revenueData?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

            setStats({
                users: userCount || 0,
                shipments: shipmentCount || 0,
                revenue: totalRevenue
            });
            setTransactions(txs || []);

        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (txId: string, userId: string, amount: number) => {
        if (!confirm('Are you sure you want to approve this deposit?')) return;

        try {
            // 1. Fetch current user balance
            const { data: userProfile, error: profileErr } = await supabase
                .from('profiles')
                .select('balance')
                .eq('id', userId)
                .single();

            if (profileErr) throw profileErr;

            // 2. Add amount to balance
            const newBalance = (userProfile.balance || 0) + amount;
            const { error: updateProfileErr } = await supabase
                .from('profiles')
                .update({ balance: newBalance })
                .eq('id', userId);

            if (updateProfileErr) throw updateProfileErr;

            // 3. Update Transaction Status
            const { error: txError } = await supabase
                .from('transactions')
                .update({ status: 'completed' })
                .eq('id', txId);

            if (txError) throw txError;

            showToast('Deposit Approved & Wallet Funded!');
            fetchAdminData(); // Refresh

        } catch (err: any) {
            console.error('Approval Error:', err);
            showToast(err.message || 'Failed to approve transaction.', 'error');
        }
    };

    const handleReject = async (txId: string) => {
        if (!confirm('Reject this transaction?')) return;
        const { error } = await supabase
            .from('transactions')
            .update({ status: 'failed' })
            .eq('id', txId);

        if (error) {
            showToast('Error rejecting transaction', 'error');
        } else {
            showToast('Transaction Rejected', 'info');
            fetchAdminData();
        }
    };

    return (
        <AdminLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 animate-fade-in-up">
                <div>
                    <div className="inline-block px-3 py-1 bg-brand-50 border border-brand-100 text-brand-600 rounded-full text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 w-fit">
                        <ShieldCheck size={14} /> System Control
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Global Overview</h1>
                    <p className="text-slate-500 font-medium">Monitoring the Pacific Cargo Platform infrastructure.</p>
                </div>
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-slate-900/20">
                    SA
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <AdminStat 
                    title="Total Users" 
                    value={stats.users.toLocaleString()} 
                    icon={Users} 
                    gradient="bg-gradient-to-br from-brand-600 to-brand-700" 
                    delay="100ms"
                />
                <AdminStat 
                    title="Active Shipments" 
                    value={stats.shipments.toLocaleString()} 
                    icon={Package} 
                    bg="bg-white"
                    color="text-brand-600"
                    delay="200ms"
                />
                <AdminStat 
                    title="Wallet Revenue" 
                    value={`₦${(stats.revenue).toLocaleString()}`} 
                    icon={Activity} 
                    bg="bg-white"
                    color="text-emerald-500"
                    delay="300ms"
                />
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900">Recent Wallet Transactions</h2>
                        <p className="text-slate-500 font-medium mt-1">Approve or reject incoming deposit requests.</p>
                    </div>
                    <button className="text-sm font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition-all">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-6">User</th>
                                <th className="px-8 py-6">Type/Method</th>
                                <th className="px-8 py-6">Amount</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6">Date</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-16 text-center">
                                        <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin"></div>
                                        <p className="mt-4 text-slate-500 font-medium">Loading transactions...</p>
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-16 text-center text-slate-500">
                                        <Activity className="mx-auto text-slate-300 mb-4" size={48} />
                                        <p className="text-lg font-medium text-slate-900 mb-1">No transactions found</p>
                                    </td>
                                </tr>
                            ) : transactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                                                {tx.profiles?.full_name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{tx.profiles?.full_name || 'Unknown'}</p>
                                                <p className="text-xs font-medium text-slate-500">{tx.profiles?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm text-slate-900 capitalize font-bold">{tx.type}</div>
                                        <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mt-1">{tx.method}</div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-slate-900 text-lg">
                                        ₦{tx.amount.toLocaleString()}
                                    </td>
                                    <td className="px-8 py-6">
                                        <StatusBadge status={tx.status} />
                                    </td>
                                    <td className="px-8 py-6 text-sm font-medium text-slate-500">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            {tx.receipt_url && (
                                                <a
                                                    href={tx.receipt_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                                                    title="View Receipt"
                                                >
                                                    <FileText size={18} />
                                                </a>
                                            )}
                                            {tx.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(tx.id, tx.user_id, tx.amount)}
                                                        className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(tx.id)}
                                                        className="p-2.5 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

const AdminStat = ({ title, value, icon: Icon, color, gradient, delay }: any) => (
    <div 
        className={`p-8 rounded-[2rem] shadow-lg border relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 animate-fade-in-up ${gradient ? 'bg-gradient-to-br border-transparent shadow-brand-900/20 ' + gradient : 'bg-white border-slate-100 shadow-slate-200/50'}`}
        style={{ animationDelay: delay }}
    >
        {gradient && <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>}

        <div className="flex justify-between items-start mb-6 relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${gradient ? 'bg-white/20 backdrop-blur-md border border-white/20 text-white' : `bg-slate-50 border border-slate-100 ${color}`}`}>
                <Icon size={24} strokeWidth={1.5} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm ${gradient ? 'bg-white/20 text-white backdrop-blur-md border border-white/20' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                LIVE <ArrowUpRight size={12} strokeWidth={3} />
            </span>
        </div>

        <div className="relative z-10">
            <h3 className={`text-4xl font-black mb-1 tracking-tight ${gradient ? 'text-white' : 'text-slate-900'}`}>{value}</h3>
            <p className={`text-sm font-bold ${gradient ? 'text-white/80' : 'text-slate-500'}`}>{title}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        pending: 'bg-amber-50 text-amber-600 border-amber-100',
        failed: 'bg-red-50 text-red-600 border-red-100'
    };

    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border flex items-center justify-center gap-1.5 w-fit ${styles[status] || styles.pending}`}>
            {status === 'pending' && <Clock size={12} strokeWidth={3} />}
            {status === 'completed' && <CheckCircle size={12} strokeWidth={3} />}
            {status === 'failed' && <XCircle size={12} strokeWidth={3} />}
            {status}
        </span>
    );
};

export default SuperAdminDashboard;
