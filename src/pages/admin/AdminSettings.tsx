import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Save, AlertCircle } from 'lucide-react';
import Toast, { ToastType } from '../../components/Toast';

const AdminSettings = () => {
    const [settingsId, setSettingsId] = useState<string | null>(null);
    const [bankName, setBankName] = useState('OPAY');
    const [accountNumber, setAccountNumber] = useState('8147398327');
    const [accountName, setAccountName] = useState('MICHAEL MAYOWA OGUNSAKIN');
    const [btcAddress, setBtcAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type });
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('app_settings')
                .select('*')
                .single();

            if (data) {
                setSettingsId(data.id);
                setBankName(data.bank_name || 'OPAY');
                setAccountNumber(data.account_number || '8147398327');
                setAccountName(data.account_name || 'MICHAEL MAYOWA OGUNSAKIN');
                setBtcAddress(data.btc_address || '');
            } else if (error) {
                // Try fetching list if single fails
                const { data: list } = await supabase.from('app_settings').select('*').limit(1);
                if (list && list.length > 0) {
                    const first = list[0];
                    setSettingsId(first.id);
                    setBankName(first.bank_name || 'OPAY');
                    setAccountNumber(first.account_number || '8147398327');
                    setAccountName(first.account_name || 'MICHAEL MAYOWA OGUNSAKIN');
                    setBtcAddress(first.btc_address || '');
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let error;
            if (settingsId) {
                const { error: updateError } = await supabase
                    .from('app_settings')
                    .update({
                        bank_name: bankName,
                        account_number: accountNumber,
                        account_name: accountName,
                        btc_address: btcAddress,
                        updated_at: new Date()
                    })
                    .eq('id', settingsId);
                error = updateError;
            } else {
                const { error: insertError } = await supabase.from('app_settings').insert({
                    bank_name: bankName,
                    account_number: accountNumber,
                    account_name: accountName,
                    btc_address: btcAddress
                });
                error = insertError;
                if (!error) fetchSettings();
            }

            if (error) throw error;
            showToast('Settings Saved Successfully!');
        } catch (err) {
            console.error(err);
            showToast('Failed to save settings.', 'error');
        }
    };

    if (loading) {
        return <AdminLayout><div className="p-8 text-slate-500">Loading settings...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900">System Settings</h1>
                    <p className="text-slate-500">Configure global parameters for the platform.</p>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    {/* Bank Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            Global Bank Details
                            <span className="text-xs font-normal text-slate-400 px-2 py-1 bg-slate-100 rounded-full">Visible to all users</span>
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Bank Name</label>
                                <input
                                    type="text"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Account Number</label>
                                <input
                                    type="text"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none font-mono"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Account Name</label>
                                <input
                                    type="text"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Crypto Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            Crypto Configuration
                            <span className="text-xs font-normal text-slate-400 px-2 py-1 bg-slate-100 rounded-full">Bitcoin</span>
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">BTC Wallet Address</label>
                            <input
                                type="text"
                                value={btcAddress}
                                onChange={(e) => setBtcAddress(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none font-mono text-sm"
                            />
                            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                                <AlertCircle size={14} />
                                Double check this address. Transactions cannot be reversed.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            className="bg-brand-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-brand-600/20 hover:bg-brand-700 transition flex items-center gap-2"
                        >
                            <Save size={20} />
                            Save Configuration
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
