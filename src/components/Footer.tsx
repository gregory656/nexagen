import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Laptop, Mail, MapPin, Phone, Play, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
    const socialLinks = [
        ['GitHub', Code2, 'https://github.com/gregory656'],
        ['LinkedIn', Laptop, 'https://www.linkedin.com/'],
        ['Instagram', Sparkles, 'https://www.instagram.com/reddevcode'],
        ['YouTube', Play, 'https://www.youtube.com/'],
    ] as const;

    return (
        <footer className="bg-black text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center">
                            <span className="font-bold text-xl">N</span>
                        </div>
                        <span className="text-2xl font-bold">NexaGen</span>
                    </div>
                    <p className="text-white/65 text-sm leading-relaxed">
                        Campus-focused technology, learning dashboards, GracyAI workflows, piano practice, programming content, and practical digital tools.
                    </p>
                    <div className="flex space-x-3">
                        {socialLinks.map(([label, Icon, href]) => (
                            <a
                                aria-label={label}
                                className="grid size-10 place-items-center rounded-full border border-white/20 bg-white text-black transition-colors hover:bg-black hover:text-white"
                                href={href}
                                key={label}
                                rel="noreferrer"
                                target="_blank"
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-bold mb-6">Explore</h4>
                    <ul className="space-y-4 text-white/65 text-sm">
                        <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                        <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
                        <li><Link to="/projects" className="hover:text-white transition-colors">Projects</Link></li>
                        <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-bold mb-6">Services</h4>
                    <ul className="space-y-4 text-white/65 text-sm">
                        <li><Link to="/contact" className="hover:text-white transition-colors">Request Quote</Link></li>
                        <li><Link to="/talk-to-ceo" className="hover:text-white transition-colors">Consultation</Link></li>
                        <li><Link to="/products" className="hover:text-white transition-colors">GracyAI Bot</Link></li>
                        <li><Link to="/donate" className="hover:text-white transition-colors">Support Us</Link></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-lg font-bold mb-6">Contact</h4>
                    <div className="space-y-4 text-white/65 text-sm">
                        <div className="flex items-center space-x-3">
                            <Phone size={18} className="text-white" />
                            <span>+254719637416</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Mail size={18} className="text-white" />
                            <span>info@nexagen.com</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <MapPin size={18} className="text-white" />
                            <span>Nairobi, Kenya</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-center text-white/45 text-xs">
                <p>© {new Date().getFullYear()} NexaGen Technology Ltd. All rights reserved.</p>
                <p className="mt-2">Powered by GracyAI</p>
            </div>
        </footer>
    );
};
