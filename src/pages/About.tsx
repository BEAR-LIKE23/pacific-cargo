import PublicLayout from '../layouts/PublicLayout';
import { Users, Globe, Award, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <PublicLayout>
            {/* Hero Section */}
            <div className="bg-slate-50 pt-20 pb-16 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] rounded-full bg-accent opacity-50 blur-3xl mix-blend-multiply"></div>
                <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[500px] h-[500px] rounded-full bg-brand-100 opacity-50 blur-3xl mix-blend-multiply"></div>
                
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <div className="flex-1 space-y-6">
                        <span className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-4 block">
                            // About Pacific Cargo
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                            Delivering Excellence <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Since 2010</span>
                        </h1>
                        <p className="text-slate-600 text-lg leading-relaxed font-light">
                            Pacific Cargo Logistics has evolved from a local courier service to a global logistics powerhouse.
                            We believe in the power of connection—bridging businesses and markets with speed, transparency, and integrity.
                        </p>
                        <div className="pt-4 flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-brand-500 w-5 h-5" />
                                <span className="font-semibold text-slate-700">Trusted Partner</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-brand-500 w-5 h-5" />
                                <span className="font-semibold text-slate-700">Global Network</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full relative">
                        <div className="absolute inset-0 bg-accent rounded-[3rem] transform -rotate-3 scale-105 z-0"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
                            alt="Warehouse Operations" 
                            className="relative z-10 rounded-[3rem] shadow-2xl object-cover h-[500px] w-full"
                        />
                        <div className="absolute -bottom-8 -left-8 z-20 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                            <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
                                <Award size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">Industry Leader</p>
                                <p className="text-2xl font-black text-slate-900">#1 Choice</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-slate-900 py-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-900/50 mix-blend-multiply"></div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-600/30 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
                    <Stat number="15+" label="Years Experience" icon={TrendingUp} />
                    <Stat number="2M+" label="Parcels Delivered" icon={Package} />
                    <Stat number="50+" label="Countries Served" icon={Globe} />
                    <Stat number="10k+" label="Happy Clients" icon={Users} />
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-24 px-4 bg-white">
                <div className="max-w-5xl mx-auto text-center">
                    <span className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-4 block">
                        // Our Vision
                    </span>
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-8">Our Mission</h2>
                    <p className="text-2xl text-slate-600 font-light leading-relaxed mb-16">
                        "To be the world's most trusted logistics partner, empowering businesses to grow by offering seamless, innovative, and sustainable shipping solutions."
                    </p>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <ValueCard title="Reliability" text="We deliver on our promises, every single time. Our global network is built on trust and consistent performance." />
                        <ValueCard title="Transparency" text="Real-time tracking and honest pricing with no hidden fees. You always know where your cargo and money is." />
                        <ValueCard title="Innovation" text="Using state-of-the-art technology to optimize routes, reduce our carbon footprint, and speed up delivery times." />
                    </div>
                </div>
            </div>
            
            {/* CTA */}
            <div className="bg-slate-50 py-20 px-4 border-t border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Ready to work with us?</h2>
                    <Link to="/contact" className="inline-flex items-center gap-2 bg-brand-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-800 transition-all shadow-md group">
                        Get in Touch
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
};

const Stat = ({ number, label, icon: Icon }: any) => (
    <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-brand-400 backdrop-blur-sm border border-white/5">
            <Icon size={32} strokeWidth={1.5} />
        </div>
        <h3 className="text-5xl font-extrabold mb-2 text-white">{number}</h3>
        <p className="text-slate-400 font-medium uppercase tracking-wide text-sm">{label}</p>
    </div>
);

const ValueCard = ({ title, text }: any) => (
    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow duration-300 hover:border-brand-100 group">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-brand-600 group-hover:scale-110 transition-transform">
            <CheckCircle2 size={24} />
        </div>
        <h4 className="font-bold text-slate-900 text-xl mb-3">{title}</h4>
        <p className="text-slate-600 leading-relaxed font-light">{text}</p>
    </div>
);

// Placeholder icon for Package since it wasn't imported in the original
const Package = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m7.5 4.27 9 5.15" />
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
    </svg>
);

export default About;
