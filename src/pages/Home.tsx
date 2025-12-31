
import { ShieldCheck, Globe, Clock, ArrowRight, Truck, Ship, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';

const Home = () => {
    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="relative bg-slate-900 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 opacity-90 z-0"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20 z-0"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
                    <div className="mb-8 flex flex-col items-center animate-fade-in-up">
                        <span className="inline-block py-1 px-3 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-semibold backdrop-blur-sm">
                            Next-Gen Logistics Solutions
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight animate-slide-up-delay">
                        Global Shipping, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-teal-400">Redefined.</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed animate-fade-in-delay">
                        Experience seamless, secure, and lightning-fast cargo delivery to over 200 countries worldwide. Track your shipment in real-time.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-fade-in-delay" style={{ animationDelay: '0.8s' }}>
                        <Link to="/track" className="group bg-brand-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-500 transition shadow-lg shadow-brand-900/50 flex items-center justify-center gap-2">
                            Track Your Shipment
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/contact" className="px-8 py-4 rounded-full font-bold text-lg text-white border border-slate-700 hover:bg-white/5 transition backdrop-blur-sm">
                            Get a Quote
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats/Trust Bar */}
            <div className="bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <Stat number="200+" label="Countries Served" />
                    <Stat number="15k+" label="Successful Deliveries" />
                    <Stat number="99.9%" label="Timely Delivery" />
                    <Stat number="24/7" label="Customer Support" />
                </div>
            </div>

            {/* Services Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Services</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">We offer comprehensive logistics solutions tailored to your specific needs.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <ServiceCard
                            icon={Plane}
                            title="Air Freight"
                            desc="Fastest delivery for time-sensitive shipments. Global coverage with major airlines."
                        />
                        <ServiceCard
                            icon={Ship}
                            title="Ocean Cargo"
                            desc="Cost-effective solution for large volume international shipping."
                        />
                        <ServiceCard
                            icon={Truck}
                            title="Ground Shipping"
                            desc="Reliable door-to-door delivery across the continent."
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Choose Pacific Cargo?</h2>
                            <div className="space-y-6">
                                <FeatureRow
                                    icon={ShieldCheck}
                                    title="Secure Handling"
                                    desc="Your cargo is insured and handled with the utmost care."
                                />
                                <FeatureRow
                                    icon={Clock}
                                    title="Real-Time Tracking"
                                    desc="Monitor your shipment's progress 24/7 with our advanced tracking system."
                                />
                                <FeatureRow
                                    icon={Globe}
                                    title="Global Network"
                                    desc="Partnerships with top carriers worldwide ensure seamless transit."
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-brand-600 rounded-2xl transform rotate-3 opacity-10"></div>
                            <img
                                src="/logistics-worker.png"
                                alt="Logistics Worker"
                                className="relative rounded-2xl shadow-xl z-10"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};

const Stat = ({ number, label }: { number: string, label: string }) => (
    <div>
        <p className="text-3xl font-bold text-brand-600 mb-1">{number}</p>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">{label}</p>
    </div>
);

const ServiceCard = ({ icon: Icon, title, desc }: any) => (
    <div className="group p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">
        <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition">
            <Icon size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

const FeatureRow = ({ icon: Icon, title, desc }: any) => (
    <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
            <Icon size={24} />
        </div>
        <div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">{title}</h4>
            <p className="text-slate-600">{desc}</p>
        </div>
    </div>
);

export default Home;
