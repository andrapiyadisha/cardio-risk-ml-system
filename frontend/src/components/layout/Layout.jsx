import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-16 bg-light-bg dark:bg-dark-bg transition-colors duration-300">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
