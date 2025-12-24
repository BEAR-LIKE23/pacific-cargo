
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Save, AlertCircle } from 'lucide-react';

const AdminSettings = () => {
    const [bankName, setBankName] = useState('Pacific Bank');
    const [accountNumber, setAccountNumber] = useState('1234567890');
    const [accountName, setAccountName] = useState('Pacific Cargo Logistics Ltd');
    const [btcAddress, setBtcAddress] = useState('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const settings = localStorage.getItem('adminSettings');
        if (settings) {
            const parsed = JSON.parse(settings);
            setBankName(parsed.bankName || 'Pacific Bank');
            setAccountNumber(parsed.accountNumber || '1234567890');
            setAccountName(parsed.accountName || 'Pacific Cargo Logistics Ltd');
            setBtcAddress(parsed.btcAddress || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh');
        }
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const settings = {
            bankName,
            accountNumber,
            accountName,
            btcAddress
        };
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <AdminLayout>
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
                        {saved && (
                            <span className="text-emerald-600 font-medium animate-fade-in flex items-center gap-2">
                                Settings Saved Successfully!
                            </span>
                        )}
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
