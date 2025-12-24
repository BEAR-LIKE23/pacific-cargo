
import React from 'react';
import UserSidebar from '../components/UserSidebar';

const UserLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen bg-slate-50">
            <UserSidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default UserLayout;
