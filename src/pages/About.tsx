import PublicLayout from '../layouts/PublicLayout';
import { Users, Globe, Award, TrendingUp } from 'lucide-react';

const About = () => {
    return (
        <PublicLayout>
            {/* Hero Section */}
            <div className="bg-slate-50 py-20 px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <span className="text-brand-600 font-bold tracking-wide uppercase text-sm">About Pacific Cargo</span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                            Delivering Excellence <br />
                            <span className="text-brand-600">Since 2010</span>
                        </h1>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Pacific Cargo Logistics has evolved from a local courier service to a global logistics powerhouse.
                            We believe in the power of connection—bridging businesses and markets with speed, transparency, and integrity.
                        </p>
                    </div>
                    <div className="flex-1 relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 mt-8">
                                <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Warehouse" className="rounded-2xl shadow-lg w-full h-48 object-cover" />
                                <img src="https://images.unsplash.com/photo-1566576912321-158fa7592484?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Cargo Ship" className="rounded-2xl shadow-lg w-full h-64 object-cover" />
                            </div>
                            <div className="space-y-4">
                                <img src="https://images.unsplash.com/photo-1580674684081-7617fbf3d425?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Logistics Team" className="rounded-2xl shadow-lg w-full h-64 object-cover" />
                                <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Delivery Truck" className="rounded-2xl shadow-lg w-full h-48 object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-slate-900 py-16 px-4 text-white">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <Stat number="15+" label="Years Experience" icon={TrendingUp} />
                    <Stat number="2M+" label="Parcels Delivered" icon={Award} />
                    <Stat number="50+" label="Countries Served" icon={Globe} />
                    <Stat number="10k+" label="Happy Clients" icon={Users} />
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
                    <p className="text-xl text-slate-500 italic font-serif">
                        "To be the world's most trusted logistics partner, empowering businesses to grow by offering seamless, innovative, and sustainable shipping solutions."
                    </p>
                    <div className="mt-12 grid md:grid-cols-3 gap-8">
                        <ValueCard title="Reliability" text="We deliver on our promises, every single time." />
                        <ValueCard title="Transparency" text="Real-time tracking and honest pricing, no hidden fees." />
                        <ValueCard title="Innovation" text="Using technology to optimize routes and reduce carbon footprint." />
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

const Stat = ({ number, label, icon: Icon }: any) => (
    <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 text-brand-400">
            <Icon size={24} />
        </div>
        <h3 className="text-4xl font-bold mb-1">{number}</h3>
        <p className="text-slate-400 text-sm">{label}</p>
    </div>
);

const ValueCard = ({ title, text }: any) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h4 className="font-bold text-slate-900 text-lg mb-3">{title}</h4>
        <p className="text-slate-500 text-sm">{text}</p>
    </div>
);

export default About;
