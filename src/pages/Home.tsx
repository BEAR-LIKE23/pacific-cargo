import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Ship,
    Plane,
    Warehouse,
    ShieldCheck,
    Headphones,
    Clock,
    Globe,
    Users,
    Award
} from 'lucide-react';

const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop", // Warehouse
    "https://images.unsplash.com/photo-1494412574643-35d32468817e?q=80&w=2053&auto=format&fit=crop", // Sea
    "https://images.unsplash.com/photo-1570710899827-022792691e86?q=80&w=2070&auto=format&fit=crop", // Air
];

const HERO_TEXTS = [
    { title: "Global Shipping,", highlight: "Redefined." },
    { title: "Fast-Track Certification,", highlight: "Guaranteed." },
    { title: "Exceptional Service,", highlight: "Worldwide." }
];

const STATS = [
    { label: "Years Experience", value: "22+", icon: Clock },
    { label: "Satisfied Clients", value: "850+", icon: Users },
    { label: "Expert Employees", value: "150+", icon: Award },
    { label: "Global Branches", value: "40+", icon: Globe },
];

const SERVICES = [
    {
        title: "Sea Transportation",
        description: "Cost-effective global shipping solutions for large volume cargo with real-time tracking.",
        icon: Ship,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Air Freight",
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

const FEATURES = [
    {
        title: "Fast Transportation",
        description: "We prioritize speed and efficiency to ensure your cargo reaches its destination on time, every time.",
        icon: Clock
    },
    {
        title: "24/7 Online Support",
        description: "Our dedicated support team is available around the clock to assist you with any queries.",
        icon: Headphones
    },
    {
        title: "Safety And Reliability",
        description: "Your cargo's safety is our top priority. We use advanced tracking and secure handling protocols.",
        icon: ShieldCheck
    }
];

const Home = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const imageInterval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000);

        const textInterval = setInterval(() => {
            setCurrentTextIndex((prev) => (prev + 1) % HERO_TEXTS.length);
        }, 4000);

        return () => {
            clearInterval(imageInterval);
            clearInterval(textInterval);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 20; // Move range -10 to 10
        const y = (clientY / window.innerHeight - 0.5) * 20;
        setMousePos({ x, y });
    };

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section
                className="relative bg-slate-900 h-[85vh] overflow-hidden flex items-center justify-center"
                onMouseMove={handleMouseMove}
            >
                {/* Background Slider */}
                {HERO_IMAGES.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-60' : 'opacity-0'}`}
                        style={{ backgroundImage: `url('${img}')` }}
                    ></div>
                ))}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-slate-900/30 z-10"></div>

                {/* Parallax Floating Elements */}
                <div
                    className="absolute top-20 right-20 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl z-10"
                    style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }}
                ></div>
                <div
                    className="absolute bottom-20 left-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl z-10"
                    style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
                ></div>

                {/* Content */}
                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center md:text-left pt-16">
                    <div className="flex flex-col items-center md:items-start animate-fade-in-up">
                        <span className="inline-block py-1.5 px-4 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-bold tracking-wide backdrop-blur-sm mb-6 uppercase">
                            Next-Gen Logistics Solutions
                        </span>

                        <div className="h-40 md:h-48 overflow-hidden mb-6 flex flex-col justify-center">
                            {HERO_TEXTS.map((text, index) => (
                                <div
                                    key={index}
                                    className={`absolute transition-all duration-700 ease-in-out transform ${index === currentTextIndex
                                        ? 'translate-y-0 opacity-100'
                                        : 'translate-y-8 opacity-0'
                                        }`}
                                >
                                    <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
                                        {text.title} <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-teal-400">
                                            {text.highlight}
                                        </span>
                                    </h1>
                                </div>
                            ))}
                            {/* Invisible spacer to maintain height */}
                            <h1 className="text-4xl md:text-7xl font-extrabold text-transparent opacity-0 leading-tight">
                                Placeholder <br /> Space
                            </h1>
                        </div>

                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed font-light">
                            Experience smooth, secure, and fast cargo delivery to over 200 countries.
                            We simplify the complex world of logistics for you.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <Link to="/login" className="group bg-brand-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-500 transition shadow-lg shadow-brand-900/50 flex items-center justify-center gap-2">
                                Login to Dashboard
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/register" className="px-8 py-4 rounded-full font-bold text-lg text-white border border-slate-400 hover:bg-white/10 transition backdrop-blur-sm flex items-center justify-center">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-brand-600 py-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        {STATS.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="flex flex-col items-center group cursor-default">
                                    <div className="mb-4 p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors transform group-hover:scale-110 duration-300">
                                        <Icon size={32} />
                                    </div>
                                    <h3 className="text-4xl font-extrabold mb-1">{stat.value}</h3>
                                    <p className="text-brand-100 font-medium uppercase text-sm tracking-wider">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features (Why Choose Us) */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">Why Choose Us</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2 mb-4">We Go The Extra Mile</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Delivering excellence through our dedicated services and commitment to your success.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {FEATURES.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                    <div className="w-16 h-16 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                                        <Icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">Our Services</span>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2">Logistics Solutions</h2>
                        </div>
                        <Link to="/services" className="text-brand-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                            View All Services <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {SERVICES.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <div key={index} className="group relative rounded-2xl overflow-hidden shadow-lg h-96">
                                    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/60 transition-colors z-10"></div>
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />

                                    <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                                        <div className="bg-white/10 backdrop-blur-md w-14 h-14 rounded-lg flex items-center justify-center text-white mb-4 border border-white/20">
                                            <Icon size={28} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                                        <p className="text-white/80 line-clamp-2 group-hover:line-clamp-none transition-all">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
