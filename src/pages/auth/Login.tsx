
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';

import { supabase } from '../../lib/supabase';

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [resetMode, setResetMode] = useState(false);
    const [success, setSuccess] = useState('');
    const isAdmin = location.pathname.includes('admin');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Ensure role check for admin login
            if (isAdmin) {
                // Check if user has 'super_admin' role in profiles table
                // Note: Ideally we set this in metadata or query profiles. 
                // For now, let's query the profile to be sure.
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();

                if (profile?.role !== 'super_admin') {
                    throw new Error('Unauthorized Access: Admins only.');
                }
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }

        } catch (err: any) {
            setError(err.message || 'Invalid login credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/login`,
            });
            if (resetError) throw resetError;
            setSuccess('Password reset link sent to your email!');
        } catch (err: any) {
            setError(err.message || 'Error sending reset link.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-brand-600 p-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Pacific Cargo</h1>
                    <p className="text-brand-100">Logistics Management System</p>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
                        {resetMode ? 'Reset Password' : (isAdmin ? 'Admin Portal' : 'Sign In')}
                    </h2>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg mb-4 text-sm font-medium">
                            {success}
                        </div>
                    )}

                    {resetMode ? (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <p className="text-sm text-slate-500 mb-4">Enter your email address and we'll send you a link to reset your password.</p>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setResetMode(false)}
                                className="w-full text-slate-500 text-sm font-medium hover:text-slate-700 transition"
                            >
                                Back to Login
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div className="flex items-center justify-end mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setResetMode(true)}
                                        className="text-sm font-medium text-brand-600 hover:text-brand-500 transition"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? 'Signing in...' : (
                                    <>Sign In <ArrowRight size={18} /></>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
