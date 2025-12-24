
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';

const EmailConfirmation = () => {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-brand-600 p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Mail className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
                    <p className="text-brand-100">We've sent a confirmation link to your inbox.</p>
                </div>

                <div className="p-8 text-center">
                    <div className="mb-6">
                        <p className="text-slate-600 mb-4">
                            Please verify your email address to activate your account and access your dashboard.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-500">
                            <p>Can't find the email? Check your spam folder or try logging in to resend.</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Link
                            to="/login"
                            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2"
                        >
                            Back to Login <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmation;
