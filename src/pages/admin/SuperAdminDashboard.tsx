
import { useEffect, useState } from 'react';
import { Package, Users, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
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
            // Use Secure RPC instead of direct updates
            const { error: rpcError } = await supabase.rpc('add_wallet_funds', {
                user_id: userId,
                amount: amount,
                reference_id: txId
            });

            if (rpcError) throw rpcError;

            // Update Transaction Status
            const { error: txError } = await supabase
                .from('transactions')
                .update({ status: 'completed' })
                .eq('id', txId);

            if (txError) throw txError;

            showToast('Deposit Approved & Wallet Funded!');
            fetchAdminData(); // Refresh

        } catch (err) {
            console.error(err);
            showToast('Failed to approve transaction.', 'error');
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
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Global Overview</h1>
                    <p className="text-slate-500">Managing Pacific Cargo Platform</p>
                </div>
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                    SA
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <AdminStat title="Total Users" value={stats.users.toLocaleString()} icon={Users} color="text-blue-500" />
                <AdminStat title="Active Shipments" value={stats.shipments.toLocaleString()} icon={Package} color="text-brand-500" />
                <AdminStat title="Wallet Revenue" value={`₦${(stats.revenue).toLocaleString()}`} icon={Activity} color="text-emerald-500" />
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="font-bold text-slate-800">Recent Wallet Transactions</h2>
                    <button className="text-sm font-bold text-brand-600">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Type/Method</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-6 text-center text-slate-500">Loading...</td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan={6} className="p-6 text-center text-slate-500">No transactions found.</td></tr>
                            ) : transactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-slate-900">{tx.profiles?.full_name || 'Unknown'}</p>
                                            <p className="text-xs text-slate-500">{tx.profiles?.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-700 capitalize font-medium">{tx.type}</div>
                                        <div className="text-xs text-slate-500 capitalize">{tx.method}</div>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                                        ₦{tx.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={tx.status} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {tx.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleApprove(tx.id, tx.user_id, tx.amount)}
                                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                                    title="Approve"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(tx.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Reject"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        )}
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

const AdminStat = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        completed: 'bg-emerald-100 text-emerald-700',
        pending: 'bg-yellow-100 text-yellow-700',
        failed: 'bg-red-100 text-red-700'
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize flex items-center gap-1 w-fit ${styles[status] || styles.pending}`}>
            {status === 'pending' && <Clock size={12} />}
            {status === 'completed' && <CheckCircle size={12} />}
            {status}
        </span>
    );
};

export default SuperAdminDashboard;
