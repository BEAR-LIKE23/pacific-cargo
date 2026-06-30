import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

import { supabase } from '../../lib/supabase';

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

            <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-slate-100">
                {/* Image Section */}
                <div className="md:w-1/2 bg-slate-900 relative hidden md:block">
                    <img 
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
                        alt="Logistics" 
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-brand-900/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-12 w-full">
                        <Link to="/" className="inline-block mb-6">
                            <span className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
                                <ShieldCheck className="text-brand-400" size={28} />
                                PACIFIC<span className="text-brand-400">CARGO</span>
                            </span>
                        </Link>
                        <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
                            Your global logistics <br/>control center.
                        </h2>
                        <p className="text-slate-300 font-light">
                            Manage shipments, track cargo in real-time, and streamline your supply chain with our state-of-the-art platform.
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white relative">
                    {/* Mobile Logo */}
                    <div className="md:hidden mb-8 text-center">
                        <Link to="/" className="inline-block">
                            <span className="text-2xl font-black text-slate-900 tracking-tighter flex items-center justify-center gap-2">
                                <ShieldCheck className="text-brand-600" size={28} />
                                PACIFIC<span className="text-brand-600">CARGO</span>
                            </span>
                        </Link>
                    </div>

                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                            {resetMode ? 'Reset Password' : (isAdmin ? 'Admin Portal' : 'Welcome back')}
                        </h1>
                        <p className="text-slate-500 font-light">
                            {resetMode ? 'Enter your email to receive a reset link.' : 'Enter your details to access your account.'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium flex items-start gap-3">
                            <div className="mt-0.5">•</div>
                            <div>{error}</div>
                        </div>
                    )}

                    {success && (
                        <div className="bg-brand-50 border border-brand-100 text-brand-600 p-4 rounded-xl mb-6 text-sm font-medium flex items-start gap-3">
                            <div className="mt-0.5">•</div>
                            <div>{success}</div>
                        </div>
                    )}

                    {resetMode ? (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-700 text-white py-4 rounded-xl font-bold hover:bg-brand-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-900/20 group"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setResetMode(false)}
                                className="w-full text-slate-500 text-sm font-medium hover:text-brand-600 transition-colors mt-2"
                            >
                                Back to Login
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-slate-700">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setResetMode(true)}
                                        className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 group mt-8"
                            >
                                {loading ? 'Signing in...' : (
                                    <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </form>
                    )}
                    
                    {!isAdmin && !resetMode && (
                        <div className="mt-8 text-center text-sm text-slate-500 font-medium">
                            Don't have an account? {' '}
                            <Link to="/register" className="text-brand-600 font-bold hover:text-brand-700 hover:underline transition-all">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
