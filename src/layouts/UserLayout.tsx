import React, { useState } from 'react';
import UserSidebar from '../components/UserSidebar';
import { Menu } from 'lucide-react';

const UserLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition duration-200 ease-in-out lg:flex`}>
                <UserSidebar onClose={() => setSidebarOpen(false)} />
            </div>

            <main className="flex-1 overflow-y-auto flex flex-col min-w-0">
                {/* Mobile header */}
                <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
                    <span className="text-xl font-black text-slate-900 tracking-tighter">
                        PACIFIC<span className="text-brand-600">CARGO</span>
                    </span>
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="text-slate-600 p-2 -mr-2"
                        aria-label="Open menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default UserLayout;
