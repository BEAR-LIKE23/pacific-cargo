
import { useState, useEffect } from 'react';
import UserLayout from '../../layouts/UserLayout';
import { supabase } from '../../lib/supabase';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, RefreshCcw } from 'lucide-react';
import clsx from 'clsx';

const Transactions = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, deposit, payment
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch Profile for balance
            const { data: profile } = await supabase
                .from('profiles')
                .select('balance')
                .eq('id', user.id)
                .single();

            if (profile) setBalance(profile.balance || 0);

            // Fetch Transactions
            const { data: txs, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTransactions(txs || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(tx => {
        if (filter === 'all') return true;
        return tx.type === filter;
    });

    return (
        <UserLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Financial Ledger</h1>
                    <p className="text-slate-500 font-medium">View your full wallet transaction history.</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                        <Wallet size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Available Balance</p>
                        <p className="text-xl font-black text-slate-900 leading-tight">₦{balance.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All Operations" />
                <FilterButton active={filter === 'deposit'} onClick={() => setFilter('deposit')} label="Deposits" />
                <FilterButton active={filter === 'payment'} onClick={() => setFilter('payment')} label="Payments" />
                <button
                    onClick={fetchData}
                    className="ml-auto p-2 text-slate-400 hover:text-brand-600 transition-colors"
                    title="Refresh Ledger"
                >
                    <RefreshCcw size={18} />
                </button>
            </div>

            {/* Transaction List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Transaction Details</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Type</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Syncing with ledger...</td></tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <Clock className="mx-auto text-slate-200 mb-2" size={32} />
                                        <p className="text-slate-400 font-medium">No transactions found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={clsx(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                                    tx.type === 'deposit' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-600"
                                                )}>
                                                    {tx.type === 'deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 leading-tight">
                                                        {tx.description || (tx.type === 'deposit' ? 'Wallet Top-up' : 'Shipment Payment')}
                                                    </p>
                                                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">ID: {tx.id.split('-')[0].toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={clsx(
                                                "px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider",
                                                tx.type === 'deposit' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                                            )}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className={clsx(
                                            "px-6 py-5 text-right font-black",
                                            tx.type === 'deposit' ? "text-emerald-600" : "text-slate-900"
                                        )}>
                                            {tx.type === 'deposit' ? '+' : '-'} ₦{tx.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={clsx(
                                                "inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full capitalize",
                                                tx.status === 'completed' ? "bg-emerald-50 text-emerald-600" :
                                                    tx.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                                            )}>
                                                <div className={clsx(
                                                    "w-1 h-1 rounded-full",
                                                    tx.status === 'completed' ? "bg-emerald-500" :
                                                        tx.status === 'pending' ? "bg-amber-500" : "bg-red-500"
                                                )} />
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-500">
                                            {new Date(tx.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </UserLayout>
    );
};

const FilterButton = ({ active, onClick, label }: any) => (
    <button
        onClick={onClick}
        className={clsx(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
            active
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
        )}
    >
        {label}
    </button>
);

export default Transactions;
