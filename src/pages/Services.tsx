import PublicLayout from '../layouts/PublicLayout';
import { Plane, Ship, Truck, Package, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
    return (
        <PublicLayout>
            {/* Hero Section */}
            <div className="bg-slate-900 pt-32 pb-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-900/40 mix-blend-multiply"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <span className="inline-block py-1 px-4 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-bold tracking-widest backdrop-blur-sm mb-6 uppercase">
                        Our Expertise
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
                        World-Class <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent">Logistics Solutions</span>
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        From individual parcels to large-scale freight, we connect your business to the world with unparalleled speed, security, and reliability.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="py-24 px-4 bg-slate-50 relative">
                {/* Decorative blob */}
                <div className="absolute top-1/2 left-0 -ml-32 w-[600px] h-[600px] rounded-full bg-accent opacity-30 blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ServiceCard
                            icon={Plane}
                            title="Air Freight"
                            description="Fastest delivery for time-sensitive shipments. Global coverage with major airlines ensuring your cargo arrives on schedule."
                            delay="0ms"
                        />
                        <ServiceCard
                            icon={Ship}
                            title="Ocean Freight"
                            description="Cost-effective solutions for large volume cargo. FCL and LCL services connecting major ports worldwide with real-time tracking."
                            delay="100ms"
                        />
                        <ServiceCard
                            icon={Truck}
                            title="Road Transport"
                            description="Reliable ground transportation network for door-to-door delivery across continents and local regions."
                            delay="200ms"
                        />
                        <ServiceCard
                            icon={Package}
                            title="Warehousing"
                            description="Secure storage facilities with advanced inventory management systems to streamline your supply chain and fulfillment."
                            delay="300ms"
                        />
                        <ServiceCard
                            icon={Globe}
                            title="Cross-Border"
                            description="Expert customs brokerage and comprehensive documentation services to ensure smooth transit across international borders."
                            delay="400ms"
                        />
                        <ServiceCard
                            icon={ShieldCheck}
                            title="Cargo Insurance"
                            description="Comprehensive protection plans for your valuable shipments, giving you total peace of mind during transit."
                            delay="500ms"
                        />
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white py-24 px-4">
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600 rounded-full blur-[100px] opacity-30 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent rounded-full blur-[100px] opacity-10 -translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to Ship?</h2>
                        <p className="text-slate-300 mb-10 max-w-xl mx-auto text-lg font-light">Get a competitive quote today, create a free account, or start tracking your existing shipment.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/register" className="bg-brand-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-500 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-brand-900/50">
                                Get a Quote <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/track" className="bg-white/10 text-white backdrop-blur-md border border-white/20 px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center">
                                Track Shipment
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

const ServiceCard = ({ icon: Icon, title, description, delay }: any) => {
    return (
        <div 
            className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl transition-all group duration-500 hover:-translate-y-2 hover:border-brand-100 animate-fade-in-up"
            style={{ animationDelay: delay }}
        >
            <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <Icon size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-brand-700 transition-colors">{title}</h3>
            <p className="text-slate-600 leading-relaxed font-light">{description}</p>
        </div>
    );
};

export default Services;
