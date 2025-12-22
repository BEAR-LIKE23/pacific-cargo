
import React from 'react';
import PublicHeader from '../components/PublicHeader';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-white">
            <PublicHeader />
            <main>
                {children}
            </main>
            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p>&copy; 2025 Pacific Cargo Logistics. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
