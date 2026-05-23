import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-brand-500 selection:text-white">
            <Navbar />
            {/* Add padding bottom on mobile to account for the MobileBottomNav (h-16 = 64px, so pb-20 = 80px) */}
            <main className="flex-grow w-full md:pb-0 pb-20">
                {children}
            </main>
            <Footer />
            <MobileBottomNav />
        </div>
    );
};

export default Layout;
