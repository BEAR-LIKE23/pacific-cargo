import PublicLayout from '../layouts/PublicLayout';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

const Contact = () => {
    return (
        <PublicLayout>
            <div className="min-h-screen bg-slate-50 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Get in Touch</h1>
                        <p className="text-slate-500 text-lg">Have a question or need a custom quote? We're here to help.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <ContactCard
                                icon={MapPin}
                                title="Visit Us"
                                info={['123 Logistics Way', 'Lagos, Nigeria 100001']}
                                color="blue"
                            />
                            <ContactCard
                                icon={Phone}
                                title="Call Us"
                                info={['+234 800 PACIFIC', '+234 123 456 7890']}
                                color="emerald"
                            />
                            <ContactCard
                                icon={Mail}
                                title="Email Us"
                                info={['support@pacific-cargo.com', 'sales@pacific-cargo.com']}
                                color="orange"
                            />
                        </div>

                        {/* Contact Form */}
                        <div className="md:col-span-2 bg-white rounded-3xl shadow-xl p-8 md:p-12">
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition" placeholder="Doe" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition" placeholder="john@example.com" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition">
                                        <option>General Inquiry</option>
                                        <option>Freight Quote</option>
                                        <option>Tracking Issue</option>
                                        <option>Partnership</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                                    <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition" placeholder="How can we help you today?"></textarea>
                                </div>

                                <button type="button" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2">
                                    Send Message <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

const ContactCard = ({ icon: Icon, title, info, color }: any) => {
    const bgColors: any = {
        blue: 'bg-blue-100 text-blue-600',
        emerald: 'bg-emerald-100 text-emerald-600',
        orange: 'bg-orange-100 text-orange-600'
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgColors[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{title}</h3>
                {info.map((line: string, i: number) => (
                    <p key={i} className="text-slate-500 text-sm">{line}</p>
                ))}
            </div>
        </div>
    );
};

export default Contact;
