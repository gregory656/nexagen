import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GracyAI } from './GracyAI';

export const Layout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-24">
                <Outlet />
            </main>
            <Footer />
            <GracyAI />
        </div>
    );
};
