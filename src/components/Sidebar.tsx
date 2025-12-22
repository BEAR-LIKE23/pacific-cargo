
import { LayoutDashboard, Package, PlusCircle, Wallet, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const Sidebar = () => {
    const location = useLocation();

    const links = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Trackings', path: '/admin/trackings', icon: Package },
        { name: 'New Tracking', path: '/admin/create-shipment', icon: PlusCircle },
        { name: 'Fund Wallet', path: '/admin/wallet', icon: Wallet }, // Placeholder
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
                <button className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-white transition-colors">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
