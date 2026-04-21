import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Share2, Users2 } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-nexagen-dark text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand & Mission */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                            <span className="text-nexagen-dark font-bold text-xl">N</span>
                        </div>
                        <span className="text-2xl font-bold">NexaGen</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Leading campus-focused technology company. Empowering smart interactions through GracyAI and innovative solutions.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-nexagen-gold transition-colors"><Share2 size={20} /></a>
                        <a href="#" className="hover:text-nexagen-gold transition-colors"><Globe size={20} /></a>
                        <a href="#" className="hover:text-nexagen-gold transition-colors"><Users2 size={20} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-bold mb-6">Explore</h4>
                    <ul className="space-y-4 text-gray-400 text-sm">
                        <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                        <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
                        <li><Link to="/projects" className="hover:text-white transition-colors">Projects</Link></li>
                        <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h4 className="text-lg font-bold mb-6">Services</h4>
                    <ul className="space-y-4 text-gray-400 text-sm">
                        <li><Link to="/contact" className="hover:text-white transition-colors">Request Quote</Link></li>
                        <li><Link to="/talk-to-ceo" className="hover:text-white transition-colors">Consultation</Link></li>
                        <li><Link to="/products" className="hover:text-white transition-colors">GracyAI Bot</Link></li>
                        <li><Link to="/donate" className="hover:text-white transition-colors">Support Us</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="space-y-6">
                    <h4 className="text-lg font-bold mb-6">Contact</h4>
                    <div className="space-y-4 text-gray-400 text-sm">
                        <div className="flex items-center space-x-3">
                            <Phone size={18} className="text-nexagen-gold" />
                            <span>+254719637416</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Mail size={18} className="text-nexagen-gold" />
                            <span>nexagen656@gmail.com</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <MapPin size={18} className="text-nexagen-gold" />
                            <span>Nairobi, Kenya</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-xs">
                <p>© {new Date().getFullYear()} NexaGen Technology Ltd. All rights reserved.</p>
                <p className="mt-2">Powered by GracyAI</p>
            </div>
        </footer>
    );
};
