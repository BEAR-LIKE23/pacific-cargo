import PublicLayout from '../layouts/PublicLayout';
import { Plane, Ship, Truck, Package, Globe, ShieldCheck, ArrowRight } from 'lucide-react';

const Services = () => {
    return (
        <PublicLayout>
            {/* Hero Section */}
            <div className="bg-slate-900 py-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-600/10 pattern-grid-lg opacity-20"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
                        World-Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-teal-400">Logistics Solutions</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                        From individual parcels to large-scale freight, we connect your business to the world with speed and reliability.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="py-20 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        <ServiceCard
                            icon={Plane}
                            title="Air Freight"
                            description="Fastest delivery for time-sensitive shipments. Global coverage with major airlines ensuring your cargo arrives on schedule."
                            color="blue"
                        />
                        <ServiceCard
                            icon={Ship}
                            title="Ocean Freight"
                            description="Cost-effective solutions for large volume cargo. FCL and LCL services connecting major ports worldwide."
                            color="teal"
                        />
                        <ServiceCard
                            icon={Truck}
                            title="Road Transport"
                            description="Reliable ground transportation network for door-to-door delivery across continents and local regions."
                            color="orange"
                        />
                        <ServiceCard
                            icon={Package}
                            title="Warehousing"
                            description="Secure storage facilities with advanced inventory management systems to streamline your supply chain."
                            color="indigo"
                        />
                        <ServiceCard
                            icon={Globe}
                            title="Cross-Border"
                            description="Expert customs brokerage and documentation services to ensure smooth transit across international borders."
                            color="purple"
                        />
                        <ServiceCard
                            icon={ShieldCheck}
                            title="Cargo Insurance"
                            description="Comprehensive protection plans for your valuable shipments, giving you peace of mind during transit."
                            color="emerald"
                        />
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white py-20 px-4">
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-6">Ready to Ship?</h2>
                        <p className="text-slate-400 mb-8 max-w-xl mx-auto">Get a competitive quote today or start tracking your existing shipment.</p>
                        <div className="flex justify-center gap-4">
                            <button className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition flex items-center gap-2">
                                Get a Quote <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

const ServiceCard = ({ icon: Icon, title, description, color }: any) => {
    const colors: any = {
        blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
        teal: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
        orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white',
        indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
        purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
        emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition group duration-300">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition duration-300 ${colors[color]}`}>
                <Icon size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 leading-relaxed">{description}</p>
        </div>
    );
};

export default Services;
