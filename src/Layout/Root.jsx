import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Root = () => {
    return (
        <div className="flex flex-col min-h-screen max-w-[2000px] mx-auto">
            <header>
                <Navbar />
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default Root;
