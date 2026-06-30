import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import {
    ArrowRight,
    Ship,
    Plane,
    Warehouse,
    ShieldCheck,
    Clock,
    Globe,
    CheckCircle2,
    Search,
    Package,
    ArrowUpRight
} from 'lucide-react';

const SERVICES = [
    {
        title: "Ocean Freight",
        description: "Cost-effective global shipping solutions for large volume cargo with real-time tracking.",
        icon: Ship,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Air Transport",
        description: "Fast and reliable air cargo services for time-sensitive shipments worldwide.",
        icon: Plane,
        image: "https://images.unsplash.com/photo-1517056636780-692a72061da4?q=80&w=2066&auto=format&fit=crop"
    },
    {
        title: "Warehousing",
        description: "Secure storage and distribution services to streamline your supply chain operations.",
        icon: Warehouse,
        image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=2072&auto=format&fit=crop"
    }
];

const STATS = [
    { value: "15+", label: "Years of Experience" },
    { value: "30+", label: "Countries Served" },
    { value: "60k+", label: "Tons of Goods Transported" }
];

const FEATURES = [
    "Global reach with local expertise.",
    "End-to-end real-time tracking.",
    "24/7 dedicated customer support.",
    "Customized logistics solutions.",
    "Secure & sustainable packaging.",
    "Fast-tracked customs clearance."
];

const Home = () => {
    const navigate = useNavigate();
    const [trackingNumber, setTrackingNumber] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (trackingNumber.trim()) {
            navigate(`/track?id=${trackingNumber}`);
        }
    };

    return (
        <PublicLayout>
            <div className="bg-slate-50 min-h-screen font-sans selection:bg-brand-500 selection:text-white">
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] rounded-full bg-accent opacity-50 blur-3xl mix-blend-multiply"></div>
                <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[500px] h-[500px] rounded-full bg-brand-100 opacity-50 blur-3xl mix-blend-multiply"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-semibold text-sm mb-6 border border-brand-100 shadow-sm animate-fade-in-up">
                                <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
                                Top Rated Shipping Partner 2026
                            </div>
                            
                            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                Take Your Shipping to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Next Level.</span>
                            </h1>
                            
                            <p className="text-lg text-slate-600 mb-10 leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                Simplify logistics, reduce costs, and deliver faster with our all-in-one global shipping management platform. Experience reliability without compromise.
                            </p>

                            {/* Tracking Widget */}
                            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                <form onSubmit={handleTrack} className="flex gap-3">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Package className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Enter your tracking number..."
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-transparent rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-brand-700 hover:bg-brand-800 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 shrink-0 group"
                                    >
                                        Track
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>
                            </div>
                            
                            <div className="mt-10 flex items-center gap-6 text-sm text-slate-500 font-medium animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                <div className="flex -space-x-3">
                                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=1" alt="User" />
                                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=2" alt="User" />
                                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=3" alt="User" />
                                </div>
                                <p>Trusted by <span className="text-slate-900 font-bold">10,000+</span> businesses worldwide</p>
                            </div>
                        </div>

                        {/* Hero Image / Composition */}
                        <div className="relative hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-white transform rotate-2 hover:rotate-0 transition-transform duration-700">
                                <img 
                                    src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop" 
                                    alt="Shipping Container" 
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-slate-900 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            Shipment PC-8472-A
                                        </span>
                                        <span className="text-brand-600 font-semibold text-sm">On Time</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
                                        <div className="bg-brand-600 h-2 rounded-full w-[75%]"></div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2 font-medium uppercase tracking-wider">Arriving in 2 Days</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="py-16 border-y border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
                        {STATS.map((stat, idx) => (
                            <div key={idx} className="py-4 md:py-0">
                                <h3 className="text-5xl font-extrabold text-slate-900 mb-2">{stat.value}</h3>
                                <p className="text-slate-500 font-medium text-lg">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION */}
            <section className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-16">
                        <span className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-2 block">
                            // Our Services
                        </span>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 max-w-2xl leading-tight">
                                Comprehensive logistics <br/>solutions for your business.
                            </h2>
                            <Link to="/services" className="inline-flex items-center gap-2 text-brand-700 font-bold hover:text-brand-800 transition-colors group">
                                View all services
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {SERVICES.map((service, index) => (
                            <div key={index} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1">
                                <div className="h-64 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img 
                                        src={service.image} 
                                        alt={service.title} 
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-8 relative">
                                    <div className="absolute -top-8 right-8 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-brand-600 rotate-3 group-hover:-rotate-3 transition-transform duration-300">
                                        <service.icon size={32} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-2 group-hover:text-brand-700 transition-colors">{service.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US SECTION */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-4 block">
                                // Why Choose Us
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                                We make global shipping <br/>feel like local delivery.
                            </h2>
                            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                                We combine industry-leading technology with decades of logistics experience to provide a shipping experience that is reliable, transparent, and built around your specific needs.
                            </p>
                            
                            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 mb-10">
                                {FEATURES.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-brand-500 shrink-0 mt-0.5" />
                                        <span className="text-slate-700 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl group">
                                Start Shipping Today
                                <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                        </div>
                        
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent rounded-[3rem] transform rotate-3 scale-105 z-0"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop" 
                                alt="Logistics Professional" 
                                className="relative z-10 rounded-[3rem] shadow-2xl object-cover h-[600px] w-full"
                            />
                            
                            {/* Floating Stats Card */}
                            <div className="absolute top-10 -left-10 z-20 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">Delivery Success</p>
                                        <p className="text-2xl font-black text-slate-900">99.9%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-brand-900/50 mix-blend-multiply"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-600/30 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
                        Ready to revolutionize your supply chain?
                    </h2>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">
                        Join thousands of businesses that trust Pacific Cargo for their global logistics needs. Create your free account and get an instant quote.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="bg-brand-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-brand-500 transition-all shadow-lg hover:shadow-brand-600/30 flex items-center justify-center gap-2">
                            Create Free Account
                        </Link>
                        <Link to="/contact" className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center">
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>
        </div>
        </PublicLayout>
    );
};

export default Home;
