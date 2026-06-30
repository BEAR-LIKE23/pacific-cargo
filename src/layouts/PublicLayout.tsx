
import React from 'react';
import PublicHeader from '../components/PublicHeader';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-white">
            <PublicHeader />
            <main>
                {children}
            </main>
            <footer className="bg-slate-950 pt-24 pb-8 border-t border-slate-900 overflow-hidden relative">
                {/* Premium Top Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-600/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                        
                        {/* Brand Column */}
                        <div className="lg:col-span-4">
                            <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
                                <img src="/logo.png" alt="Pacific Cargo" className="h-12 w-auto object-contain bg-white rounded-xl p-1.5 shadow-lg group-hover:scale-105 transition-transform" />
                                <span className="text-2xl font-black text-white tracking-tighter">
                                    PACIFIC<span className="text-brand-500">CARGO</span>
                                </span>
                            </Link>
                            <p className="text-slate-400 leading-relaxed mb-8 pr-4">
                                Redefining global logistics with next-generation tracking, AI-powered routing, and uncompromising security.
                            </p>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-brand-400 hover:border-brand-500/50 hover:bg-slate-800 transition-all cursor-pointer">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-brand-400 hover:border-brand-500/50 hover:bg-slate-800 transition-all cursor-pointer">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-brand-400 hover:border-brand-500/50 hover:bg-slate-800 transition-all cursor-pointer">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.162.336.324.672.48 1.011-4.32 1.42-8.363 5.418-8.522 5.58AB8.55 8.55 0 013.453 12.01zm2.42 6.772c.162-.17 3.864-4.148 8.163-5.516.27.534.54 1.069.805 1.603-2.072 1.583-4.425 4.072-4.593 4.26A8.527 8.527 0 015.872 18.78zm3.569 1.13c.174-.191 2.505-2.651 4.568-4.17 1.258 3.125 1.503 5.474 1.545 5.864a8.557 8.557 0 01-6.113-1.694z" clipRule="evenodd" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="lg:col-span-2 lg:col-start-6">
                            <h4 className="text-white font-bold mb-6 text-lg">Services</h4>
                            <ul className="space-y-4 text-sm font-medium">
                                <li><Link to="/services" className="text-slate-400 hover:text-brand-400 hover:translate-x-1 inline-flex transition-all">Air Freight</Link></li>
                                <li><Link to="/services" className="text-slate-400 hover:text-brand-400 hover:translate-x-1 inline-flex transition-all">Ocean Freight</Link></li>
                                <li><Link to="/services" className="text-slate-400 hover:text-brand-400 hover:translate-x-1 inline-flex transition-all">Road Transport</Link></li>
                                <li><Link to="/services" className="text-slate-400 hover:text-brand-400 hover:translate-x-1 inline-flex transition-all">Supply Chain</Link></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div className="lg:col-span-2">
                            <h4 className="text-white font-bold mb-6 text-lg">Company</h4>
                            <ul className="space-y-4 text-sm font-medium">
                                <li><Link to="/about" className="text-slate-400 hover:text-brand-400 hover:translate-x-1 inline-flex transition-all">About Us</Link></li>
                                <li><Link to="/contact" className="text-slate-400 hover:text-brand-400 hover:translate-x-1 inline-flex transition-all">Contact</Link></li>
                                <li><Link to="/track" className="text-slate-400 hover:text-brand-400 hover:translate-x-1 inline-flex transition-all">Track Shipment</Link></li>
                                <li><Link to="/login" className="text-slate-400 hover:text-brand-400 hover:translate-x-1 inline-flex transition-all">Client Login</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="lg:col-span-3">
                            <h4 className="text-white font-bold mb-6 text-lg">Contact Us</h4>
                            <ul className="space-y-5 text-sm text-slate-400">
                                <li className="flex items-start gap-3 group cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand-500/10 group-hover:border-brand-500/30 transition-all">
                                        <MapPin className="text-brand-500" size={14} />
                                    </div>
                                    <span className="leading-relaxed group-hover:text-slate-300 transition-colors">123 Logistics Way, Suite 100<br/>New York, NY 10001</span>
                                </li>
                                <li className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:bg-brand-500/10 group-hover:border-brand-500/30 transition-all">
                                        <Phone className="text-brand-500" size={14} />
                                    </div>
                                    <span className="group-hover:text-slate-300 transition-colors">+1 (800) 123-4567</span>
                                </li>
                                <li className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:bg-brand-500/10 group-hover:border-brand-500/30 transition-all">
                                        <Mail className="text-brand-500" size={14} />
                                    </div>
                                    <span className="group-hover:text-slate-300 transition-colors">support@pacific-cargo.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm font-medium">&copy; {new Date().getFullYear()} Pacific Cargo Logistics. All rights reserved.</p>
                        <div className="flex gap-8 text-sm font-medium text-slate-500">
                            <span className="hover:text-brand-400 cursor-pointer transition-colors">Privacy Policy</span>
                            <span className="hover:text-brand-400 cursor-pointer transition-colors">Terms of Service</span>
                            <span className="hover:text-brand-400 cursor-pointer transition-colors">Cookies</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
