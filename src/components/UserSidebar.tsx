
import { LayoutDashboard, Package, PlusCircle, Wallet, LogOut, MapPin, RefreshCcw } from 'lucide-react';
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
        <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold text-brand-400">Pacific Cargo</h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={clsx(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                                isActive ? "bg-brand-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <Icon size={20} />
                            <span>{link.name}</span>
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
                    className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-white transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default UserSidebar;
