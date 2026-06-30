import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';

import { supabase } from '../../lib/supabase';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Sign up user
            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (authError) throw authError;

            if (data.user) {
                // Success! The trigger in SQL will handle profile creation.
                navigate('/auth/confirm-email');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-brand-600/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] translate-y-1/3 translate-x-1/3 pointer-events-none"></div>

            <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-slate-100">
                {/* Form Section */}
                <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white relative">
                    {/* Mobile Logo */}
                    <div className="md:hidden mb-8 text-center">
                        <Link to="/" className="inline-block">
                            <img src="/logo.png" alt="Pacific Cargo" className="h-12 w-auto object-contain mx-auto" />
                        </Link>
                    </div>

                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create an account</h1>
                        <p className="text-slate-500 font-light">Join Pacific Cargo Logistics and take control of your supply chain.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium flex items-start gap-3">
                            <div className="mt-0.5">•</div>
                            <div>{error}</div>
                        </div>
                    )}
                    
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-2 font-medium">Must be at least 6 characters long.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 group mt-8"
                        >
                            {loading ? 'Creating Account...' : (
                                <>Sign Up <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500 font-medium">
                        Already have an account? {' '}
                        <Link to="/login" className="text-brand-600 font-bold hover:text-brand-700 hover:underline transition-all">Sign In</Link>
                    </div>
                </div>

                {/* Image Section */}
                <div className="md:w-1/2 bg-slate-900 relative hidden md:block">
                    <img 
                        src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop" 
                        alt="Logistics Fleet" 
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-brand-900/40 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 p-12 w-full text-right">
                        <Link to="/" className="inline-block mb-6">
                            <img src="/logo.png" alt="Pacific Cargo" className="h-12 w-auto object-contain brightness-0 invert" />
                        </Link>
                        <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
                            The future of shipping <br/>starts here.
                        </h2>
                        <p className="text-slate-300 font-light ml-auto max-w-sm">
                            Join a network of over 10,000 businesses relying on our secure, fast, and transparent global logistics infrastructure.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
