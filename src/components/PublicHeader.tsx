
import { Package, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const PublicHeader = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-2">
                        <div className="bg-brand-600 p-2 rounded-lg">
                            <Package className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-bold text-slate-900">Pacific<span className="text-brand-600">Cargo</span></span>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" className="text-slate-600 hover:text-brand-600 font-medium transition">Home</Link>
                        <Link to="/track" className="text-slate-600 hover:text-brand-600 font-medium transition">Track Shipment</Link>
                        <Link to="/services" className="text-slate-600 hover:text-brand-600 font-medium transition">Services</Link>
                        <Link to="/contact" className="text-slate-600 hover:text-brand-600 font-medium transition">Contact</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/admin/login" className="hidden md:block text-slate-600 font-medium hover:text-slate-900">Login</Link>
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
                    <Link to="/admin/login" className="block text-slate-600 font-medium">Admin Login</Link>
                </div>
            )}
        </header>
    );
};

export default PublicHeader;
