import { LayoutDashboard, Package, PlusCircle, Wallet, LogOut, MapPin, RefreshCcw, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import clsx from 'clsx';

const UserSidebar = () => {
    const location = useLocation();

    const links = [
        { name: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'My Shipments', path: '/dashboard/shipments', icon: Package },
        { name: 'Create Shipment', path: '/dashboard/create-shipment', icon: PlusCircle },
        { name: 'Address Book', path: '/dashboard/addresses', icon: MapPin },
        { name: 'Financial Ledger', path: '/dashboard/transactions', icon: RefreshCcw },
        { name: 'Fund Wallet', path: '/dashboard/wallet', icon: Wallet },
    ];

    return (
        <div className="w-72 bg-slate-900 text-white min-h-screen flex flex-col relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-600/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <div className="p-8 border-b border-white/10 relative z-10">
                <Link to="/" className="inline-block">
                    <span className="text-xl font-black text-white tracking-tighter flex items-center gap-2">
                        <ShieldCheck className="text-brand-500" size={24} />
                        PACIFIC<span className="text-brand-500">CARGO</span>
                    </span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1.5 relative z-10 mt-4">
                <div className="px-4 mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Main Menu</div>
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={clsx(
                                "flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group",
                                isActive 
                                    ? "bg-brand-600 text-white shadow-lg shadow-brand-900/50" 
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon size={20} className={isActive ? "text-white" : "text-slate-500 group-hover:text-brand-400 transition-colors"} />
                            <span className="font-semibold">{link.name}</span>
                            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 relative z-10">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
                            <RefreshCcw size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium">System Status</p>
                            <p className="text-sm font-bold text-emerald-400">All Systems Operational</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.href = '/';
                    }}
                    className="flex items-center space-x-3 px-4 py-3.5 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 font-semibold group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default UserSidebar;
