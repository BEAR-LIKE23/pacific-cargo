
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
        <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-2 text-brand-400 font-bold text-xl">
                    <ShieldAlert /> Super Admin
                </div>
            </div>
            <nav className="p-4 space-y-2 flex-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition",
                                isActive ? "bg-brand-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.href = '/';
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white transition"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
