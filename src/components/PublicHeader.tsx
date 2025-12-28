
import { Package, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const PublicHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    return (
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-brand-600 p-2 rounded-lg">
                            <Package className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-bold text-slate-900">Pacific<span className="text-brand-600">Cargo</span></span>
                    </Link>

                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" className="text-slate-600 hover:text-brand-600 font-medium transition">Home</Link>
                        <Link to="/track" className="text-slate-600 hover:text-brand-600 font-medium transition">Track Shipment</Link>
                        <Link to="/services" className="text-slate-600 hover:text-brand-600 font-medium transition">Services</Link>
                        <Link to="/contact" className="text-slate-600 hover:text-brand-600 font-medium transition">Contact</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="hidden md:flex items-center gap-6">
                                <Link to="/dashboard" className="flex items-center gap-2 text-slate-700 font-bold hover:text-brand-600 transition">
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </Link>
                                <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 transition p-2" title="Sign Out">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="hidden md:block text-slate-600 font-medium hover:text-slate-900">Login</Link>
                        )}
                        <Link to="/track" className="bg-brand-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-200">
                            Track Now
                        </Link>
                        <button className="md:hidden text-slate-600" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4 shadow-lg">
                    <Link to="/" className="block text-slate-600 font-medium">Home</Link>
                    <Link to="/track" className="block text-slate-600 font-medium">Track Shipment</Link>
                    <Link to="/services" className="block text-slate-600 font-medium">Services</Link>
                    <Link to="/contact" className="block text-slate-600 font-medium">Contact</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="block text-brand-600 font-bold">User Dashboard</Link>
                            <button onClick={handleLogout} className="block text-red-600 font-medium">Sign Out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block text-slate-600 font-medium">User Login</Link>
                            <Link to="/admin/login" className="block text-slate-500 text-sm font-medium">Admin Portal</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

export default PublicHeader;
