
import React, { useState, useEffect } from 'react';
import UserLayout from '../../layouts/UserLayout';
import { CreditCard, Bitcoin, Landmark, Copy, CheckCircle2, ArrowRight } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const FundWallet = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('crypto'); // crypto, bank, card
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [balance, setBalance] = useState(0);

    // Paystack Config
    const config = {
        reference: (new Date()).getTime().toString(),
        email: user?.email || "user@example.com",
        amount: (parseFloat(amount) || 0) * 100, // Paystack takes kobo (x100)
        publicKey: 'pk_test_66347513f7873d7990696de498186eaeade2896b', // TEST KEY
    };

    const initializePayment = usePaystackPayment(config);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUser(user);
            const { data: profile } = await supabase.from('profiles').select('balance').eq('id', user.id).single();
            if (profile) setBalance(profile.balance);
        } else {
            navigate('/login');
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const onSuccess = async () => {
        setLoading(true);
        // 1. Create Transaction Record
        const { error: txError } = await supabase.from('transactions').insert({
            user_id: user.id,
            amount: parseFloat(amount),
            type: 'deposit',
            status: 'completed',
            method: 'card',
            description: 'Wallet funding via Paystack'
        });

        // 2. Update User Balance (Ideally use RPC function for safety, but direct update for MVP)
        const { error: balError } = await supabase.from('profiles').update({
            balance: balance + parseFloat(amount)
        }).eq('id', user.id);

        if (!txError && !balError) {
            alert('Payment Successful! Wallet funded.');
            fetchUserData(); // Refresh balance
            setAmount('');
        } else {
            alert('Payment succeeded but creating record failed. Contact support.');
        }
        setLoading(false);
    };

    const onClose = () => {
        alert('Payment cancelled.');
        setLoading(false);
    };

    const handleManualDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('transactions').insert({
            user_id: user.id,
            amount: parseFloat(amount),
            type: 'deposit',
            status: 'pending',
            method: method,
            description: `Manual deposit via ${method === 'bank' ? 'Bank Transfer' : 'Crypto'}`
        });

        if (error) {
            alert('Error creating request.');
        } else {
            alert('Deposit request submitted! Admin will approve shortly.');
            setAmount('');
        }
        setLoading(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;

        if (method === 'card') {
            initializePayment({ onSuccess, onClose });
        } else {
            handleManualDeposit(e);
        }
    };

    return (
        <UserLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Fund Wallet</h1>
                    <p className="text-slate-500">Add funds to your account to pay for shipments.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Balance & Amount */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Current Balance Card */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative z-10">
                                <p className="text-slate-400 font-medium mb-1">Current Balance</p>
                                <h2 className="text-4xl font-bold mb-6">₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</h2>

                                <div className="flex gap-3">
                                    <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                        <span className="text-sm font-medium">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Select Payment Method</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <PaymentMethodCard
                                    active={method === 'crypto'}
                                    onClick={() => setMethod('crypto')}
                                    icon={Bitcoin}
                                    label="Crypto"
                                />
                                <PaymentMethodCard
                                    active={method === 'bank'}
                                    onClick={() => setMethod('bank')}
                                    icon={Landmark}
                                    label="Bank Transfer"
                                />
                                <PaymentMethodCard
                                    active={method === 'card'}
                                    onClick={() => setMethod('card')}
                                    icon={CreditCard}
                                    label="Credit Card"
                                />
                            </div>
                        </div>

                        {/* Payment Details (Dynamic) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            {method === 'crypto' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                            <Bitcoin size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Pay with Bitcoin</h4>
                                            <p className="text-sm text-slate-500">Send BTC to the address below</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between group">
                                        <code className="text-slate-600 font-mono text-sm break-all">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</code>
                                        <button
                                            onClick={() => handleCopy('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')}
                                            className="p-2 text-slate-400 hover:text-brand-600 transition"
                                        >
                                            {copied ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Copy size={20} />}
                                        </button>
                                    </div>

                                    <div className="p-4 bg-blue-50 text-blue-700 text-sm rounded-lg flex gap-2">
                                        <div className="shrink-0 mt-0.5">ℹ️</div>
                                        <p>Funds will be credited automatically after 2 network confirmations (Manual approval required for now).</p>
                                    </div>
                                </div>
                            )}

                            {method === 'bank' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                            <Landmark size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Bank Transfer</h4>
                                            <p className="text-sm text-slate-500">Make a transfer to the following account</p>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Bank Name</p>
                                            <p className="font-bold text-slate-900">Pacific Bank</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Account Number</p>
                                            <div className="flex items-center justify-between">
                                                <p className="font-bold text-slate-900 font-mono">1234567890</p>
                                                <button onClick={() => handleCopy('1234567890')} className="text-slate-400 hover:text-brand-600">
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Account Name</p>
                                            <p className="font-bold text-slate-900">Pacific Cargo Logistics Ltd</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {method === 'card' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                                            <CreditCard size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Credit / Debit Card</h4>
                                            <p className="text-sm text-slate-500">Secured by Paystack</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-purple-50 text-purple-700 text-sm rounded-lg flex gap-2">
                                        <div className="shrink-0 mt-0.5">🚀</div>
                                        <p>Payments are instant! Your wallet will be funded immediately after success.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Deposit Form */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sticky top-8">
                            <h3 className="font-bold text-slate-900 mb-6">Deposit Amount</h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Enter Amount (₦)</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full text-2xl font-bold p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Subtotal</span>
                                        <span className="font-medium">₦{amount ? parseFloat(amount).toLocaleString() : '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Processing Fee</span>
                                        <span className="font-medium">₦0.00</span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 flex justify-between text-lg font-bold">
                                        <span className="text-slate-900">Total</span>
                                        <span className="text-brand-600">₦{amount ? parseFloat(amount).toLocaleString() : '0.00'}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !amount || !user}
                                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Processing...' : (
                                        <>
                                            {method === 'card' ? 'Pay with Paystack' : 'Submit Request'}
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

const PaymentMethodCard = ({ active, onClick, icon: Icon, label }: any) => (
    <div
        onClick={onClick}
        className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col items-center gap-3 ${active ? 'border-brand-500 bg-brand-50/50' : 'border-slate-100 hover:border-slate-200'}`}
    >
        <Icon size={24} className={active ? 'text-brand-600' : 'text-slate-400'} />
        <span className={`text-sm font-bold ${active ? 'text-brand-700' : 'text-slate-600'}`}>{label}</span>
    </div>
);

export default FundWallet;
