
import React, { useState, useEffect } from 'react';
import UserLayout from '../../layouts/UserLayout';
import { CreditCard, Coins, Landmark, Copy, CheckCircle2, ArrowRight, Upload, FileText } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Toast, { ToastType } from '../../components/Toast';

const FundWallet = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('crypto'); // crypto, bank, card
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [balance, setBalance] = useState(0);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type });
    };
    const [appSettings, setAppSettings] = useState({
        bank_name: 'OPAY',
        account_number: '8147398327',
        account_name: 'MICHAEL MAYOWA OGUNSAKIN',
        usdt_address: ''
    });

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

            // Fetch App Settings
            const { data: settings } = await supabase.from('app_settings').select('*').single();
            if (settings) {
                setAppSettings({
                    bank_name: settings.bank_name || 'Pacific Bank',
                    account_number: settings.account_number || '',
                    account_name: settings.account_name || 'Pacific Cargo',
                    usdt_address: settings.usdt_address || ''
                });
            } else {
                // Try fallback fetch
                const { data: list } = await supabase.from('app_settings').select('*').limit(1);
                if (list && list.length > 0) {
                    setAppSettings(list[0]);
                }
            }
        } else {
            navigate('/login');
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const onSuccess = async (response: any) => {
        setLoading(true);
        console.log('Paystack success response:', response);
        try {
            // Paystack sometimes returns reference in response.reference or response.trxref
            const referenceId = response.reference || response.trxref || `PS-${Date.now()}`;

            // Use secure RPC function to update balance and record transaction
            const { error } = await supabase.rpc('add_wallet_funds', {
                amount: parseFloat(amount),
                reference_id: referenceId,
                user_id: user.id // Pass user_id explicitly for robustness
            });

            if (error) {
                console.error('RPC Error details:', error);
                throw error;
            }

            showToast('Payment Successful! Wallet funded.');
            fetchUserData(); // Refresh balance
            setAmount('');
        } catch (err) {
            console.error(err);
            showToast('Payment succeeded but wallet update failed. Contact support.', 'error');
        }
        setLoading(false);
    };

    const onClose = () => {
        showToast('Payment cancelled.', 'info');
        setLoading(false);
    };

    const handleManualDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!receiptFile) {
                showToast('Please upload proof of payment', 'error');
                setLoading(false);
                return;
            }

            // 1. Upload Receipt
            setUploading(true);
            const fileExt = receiptFile.name.split('.').pop();
            const fileName = `${user.id}_${Date.now()}.${fileExt}`;
            const filePath = `receipts/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('receipts')
                .upload(filePath, receiptFile);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('receipts')
                .getPublicUrl(filePath);

            // 2. Create Transaction
            const { error: txError } = await supabase.from('transactions').insert({
                user_id: user.id,
                amount: parseFloat(amount),
                type: 'deposit',
                status: 'pending',
                method: method,
                receipt_url: publicUrl,
                description: `Deposit via ${method === 'bank' ? 'Bank Transfer' : 'USDT'}`
            });

            if (txError) throw txError;

            showToast('Deposit submitted! Admin will verify your receipt shortly.');
            setAmount('');
            setReceiptFile(null);
        } catch (error: any) {
            console.error(error);
            showToast(error.message || 'Error processing request', 'error');
        } finally {
            setLoading(false);
            setUploading(false);
        }
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
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
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
                                    icon={Coins}
                                    label="USDT"
                                />
                                <PaymentMethodCard
                                    active={method === 'bank'}
                                    onClick={() => setMethod('bank')}
                                    icon={Landmark}
                                    label="Bank Transfer"
                                />
                                <PaymentMethodCard
                                    active={method === 'card'}
                                    onClick={() => { }}
                                    icon={CreditCard}
                                    label="Credit Card"
                                    disabled={true}
                                />
                            </div>
                        </div>


                        {/* Payment Details (Dynamic) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            {method === 'crypto' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <Coins size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Pay with USDT (Tether)</h4>
                                            <p className="text-sm text-slate-500">Send USDT to the address below (TRC20/ERC20)</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between group">
                                        <code className="text-slate-600 font-mono text-sm break-all">{appSettings.usdt_address}</code>
                                        <button
                                            onClick={() => handleCopy(appSettings.usdt_address)}
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
                                            <p className="font-bold text-slate-900">{appSettings.bank_name}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Account Number</p>
                                            <div className="flex items-center justify-between">
                                                <p className="font-bold text-slate-900 font-mono">{appSettings.account_number}</p>
                                                <button onClick={() => handleCopy(appSettings.account_number)} className="text-slate-400 hover:text-brand-600">
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Account Name</p>
                                            <p className="font-bold text-slate-900">{appSettings.account_name}</p>
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

                            {/* Receipt Upload (Shown for Bank/USDT) */}
                            {(method === 'bank' || method === 'crypto') && (
                                <div className="mt-8 pt-8 border-t border-slate-100">
                                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Upload size={18} className="text-brand-600" />
                                        Upload Proof of Payment
                                    </h4>

                                    <div className="relative group">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                                            accept="image/*,.pdf"
                                        />
                                        <div className={`p-8 border-2 border-dashed rounded-2xl text-center transition ${receiptFile ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 group-hover:border-brand-300'}`}>
                                            {receiptFile ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileText size={40} className="text-emerald-500" />
                                                    <p className="font-bold text-emerald-700">{receiptFile.name}</p>
                                                    <p className="text-xs text-emerald-600">Click or drag to replace</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                                    <Upload size={40} />
                                                    <p className="font-medium text-slate-600">Select transfer receipt</p>
                                                    <p className="text-xs">Supports PNG, JPG, or PDF</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {uploading && (
                                        <div className="mt-4 flex items-center justify-center gap-2 text-brand-600 text-sm font-bold">
                                            <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
                                            Uploading receipt...
                                        </div>
                                    )}
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

const PaymentMethodCard = ({ active, onClick, icon: Icon, label, disabled }: any) => (
    <div
        onClick={!disabled ? onClick : undefined}
        className={`p-4 rounded-xl border-2 transition flex flex-col items-center gap-3 relative overflow-hidden ${disabled ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed' : (active ? 'border-brand-500 bg-brand-50/50 cursor-pointer' : 'border-slate-100 hover:border-slate-200 cursor-pointer')}`}
    >
        {disabled && (
            <div className="absolute top-2 right-[-1.5rem] bg-slate-200 text-slate-600 text-[10px] font-bold py-0.5 px-6 rotate-45 transform">
                SOON
            </div>
        )}
        <Icon size={24} className={active ? 'text-brand-600' : 'text-slate-400'} />
        <span className={`text-sm font-bold ${active ? 'text-brand-700' : 'text-slate-600'}`}>{label}</span>
    </div>
);

export default FundWallet;
