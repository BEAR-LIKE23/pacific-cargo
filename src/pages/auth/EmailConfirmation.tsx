import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

const EmailConfirmation = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-brand-600/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] translate-y-1/3 translate-x-1/3 pointer-events-none"></div>

            <div className="max-w-lg w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-slate-100">
                {/* Header Gradient Area */}
                <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-12 text-center relative overflow-hidden">
                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20 shadow-inner">
                            <Mail className="text-white" size={40} strokeWidth={1.5} />
                        </div>
                        <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Check Your Inbox</h1>
                        <p className="text-brand-100 text-lg">We've sent a magic link your way.</p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-10 text-center">
                    <div className="mb-8">
                        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                            Please verify your email address to activate your account and access your dashboard.
                        </p>
                        
                        <div className="bg-brand-50/50 p-5 rounded-2xl border border-brand-100 flex items-start text-left gap-4">
                            <CheckCircle2 className="text-brand-500 shrink-0 mt-0.5" size={24} />
                            <div>
                                <h4 className="font-bold text-slate-800 mb-1">Didn't receive the email?</h4>
                                <p className="text-slate-500 text-sm">
                                    Sometimes they get lost. Check your spam folder or try logging in to trigger a new link.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Link
                            to="/login"
                            className="w-full group bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/20 transition-all flex items-center justify-center gap-2"
                        >
                            Return to Login 
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmation;
