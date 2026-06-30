import PublicLayout from '../layouts/PublicLayout';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

const Contact = () => {
    return (
        <PublicLayout>
            {/* Hero Section */}
            <div className="bg-slate-900 pt-32 pb-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-900/40 mix-blend-multiply"></div>
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <span className="inline-block py-1 px-4 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-bold tracking-widest backdrop-blur-sm mb-6 uppercase">
                        24/7 Support
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                        Let's Talk <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent">Logistics</span>
                    </h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                        Have a question, need a custom quote, or experiencing an issue? Our global support team is ready to help you navigate your shipping needs.
                    </p>
                </div>
            </div>

            <div className="min-h-screen bg-slate-50 py-24 px-4 relative">
                {/* Decorative blob */}
                <div className="absolute top-1/2 right-0 -mr-32 w-[600px] h-[600px] rounded-full bg-brand-100 opacity-40 blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <ContactCard
                                icon={MapPin}
                                title="Global Headquarters"
                                info={['123 Logistics Way, Suite 400', 'Lagos, Nigeria 100001']}
                                delay="0ms"
                            />
                            <ContactCard
                                icon={Phone}
                                title="Phone Support"
                                info={['+234 800 PACIFIC (Toll Free)', '+234 123 456 7890 (Direct)']}
                                delay="100ms"
                            />
                            <ContactCard
                                icon={Mail}
                                title="Email Us"
                                info={['support@pacific-cargo.com', 'sales@pacific-cargo.com']}
                                delay="200ms"
                            />
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <div className="mb-10">
                                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Send us a message</h2>
                                <p className="text-slate-500 font-light">We usually respond within 24 hours.</p>
                            </div>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                                        <input type="text" className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all text-slate-900 placeholder-slate-400" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                                        <input type="text" className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all text-slate-900 placeholder-slate-400" placeholder="Doe" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                    <input type="email" className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all text-slate-900 placeholder-slate-400" placeholder="john@example.com" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Topic</label>
                                    <select className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all text-slate-900">
                                        <option>General Inquiry</option>
                                        <option>Freight Quote</option>
                                        <option>Tracking Issue</option>
                                        <option>Partnership & Careers</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                                    <textarea rows={6} className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all text-slate-900 placeholder-slate-400 resize-none" placeholder="How can we help you today?"></textarea>
                                </div>

                                <button type="button" className="w-full bg-brand-700 text-white font-bold py-5 rounded-xl hover:bg-brand-800 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-brand-900/20 mt-4">
                                    Send Message 
                                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

const ContactCard = ({ icon: Icon, title, info, delay }: any) => {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-6 hover:shadow-xl transition-shadow duration-300 hover:border-brand-100 group animate-fade-in-up" style={{ animationDelay: delay }}>
            <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0 text-brand-600 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                <Icon size={28} strokeWidth={1.5} />
            </div>
            <div>
                <h3 className="font-bold text-slate-900 text-xl mb-2 group-hover:text-brand-700 transition-colors">{title}</h3>
                <div className="space-y-1">
                    {info.map((line: string, i: number) => (
                        <p key={i} className="text-slate-500 font-light leading-relaxed">{line}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Contact;
