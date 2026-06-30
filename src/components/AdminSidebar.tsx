import { Activity, Users, Package, Settings, ShieldAlert, LogOut, Bell, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import clsx from 'clsx';

const AdminSidebar = () => {
    const location = useLocation();

    const links = [
        { name: 'Overview', path: '/admin/dashboard', icon: Activity },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'User Management', path: '/admin/users', icon: Users },
        { name: 'All Shipments', path: '/admin/shipments', icon: Package },
        { name: 'Broadcast Messages', path: '/admin/notifications', icon: Bell },
        { name: 'System Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <aside className="w-72 bg-slate-900 text-white flex-shrink-0 flex flex-col h-screen sticky top-0 overflow-hidden relative">
            {/* Decorative background glow */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-600/10 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <div className="p-8 border-b border-white/10 relative z-10">
                <Link to="/" className="inline-block mb-4">
                    <img src="/logo.png" alt="Pacific Cargo" className="h-10 w-auto object-contain" />
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs uppercase tracking-widest backdrop-blur-sm">
                    <ShieldAlert size={14} /> Super Admin
                </div>
            </div>
            
            <nav className="p-4 space-y-1.5 flex-1 mt-4 relative z-10">
                <div className="px-4 mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Admin Control</div>
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group",
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

            <div className="p-6 border-t border-white/10 relative z-10">
                <button
                    onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.href = '/';
                    }}
                    className="flex items-center gap-3 px-4 py-3.5 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 font-semibold group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
