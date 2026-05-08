import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare, Briefcase, Info, Home, Settings } from 'lucide-react';
import { Button } from './shared/Button';
import { cn } from '../lib/utils';

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Products', path: '/products', icon: Settings },
        { name: 'Projects', path: '/projects', icon: Briefcase },
        { name: 'About', path: '/about', icon: Info },
        { name: 'Contact', path: '/contact', icon: MessageSquare },
    ];

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 py-4",
            isScrolled ? "py-2" : "py-4"
        )}>
            <div className={cn(
                "max-w-7xl mx-auto glass rounded-full px-6 py-2 flex items-center justify-between transition-all duration-300",
                isScrolled ? "bg-white/80" : "bg-white/40"
            )}>
{/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
<div className="w-10 h-10 rounded-full nexagen-bg flex items-center justify-center overflow-hidden border-2 border-white/30 shadow-lg">
                        <img src="/nexagen.jpeg" alt="NexaGen" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-2xl font-bold text-nexagen-green hidden sm:inline-block">
                        Nexa<span className="text-nexagen-blue">Gen</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-nexagen-accent",
                                location.pathname === link.path ? "text-nexagen-green" : "text-gray-600"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/talk-to-ceo">
                        <Button size="sm" variant="primary">Talk to CEO</Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-nexagen-green"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-4 right-4 glass rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4">
                    <div className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="flex items-center space-x-4 text-gray-700 font-medium p-2 rounded-lg hover:bg-nexagen-green/5"
                                onClick={() => setIsOpen(false)}
                            >
                                <link.icon size={20} className="text-nexagen-green" />
                                <span>{link.name}</span>
                            </Link>
                        ))}
                        <Link to="/talk-to-ceo" onClick={() => setIsOpen(false)}>
                            <Button className="w-full" variant="primary">Talk to CEO</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
