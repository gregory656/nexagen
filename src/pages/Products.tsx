import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Cpu, Download, Sparkles, Zap } from 'lucide-react';
import { Button } from '../components/shared/Button';
import { GlassCard } from '../components/shared/GlassCard';

export const Products: React.FC = () => {
    const products = [
        {
            name: 'Gracy Chat',
            tagline: 'Connect. Commmunicate. Conquer.',
            description: 'The ultimate campus communication tool. Real-time messaging, file sharing, and group coordination designed specifically for the academic environment.',
            icon: Cloud,
            features: ['End-to-end encryption', 'Large file support', 'Campus-wide announcements', 'Anonymous feedback channels'],
            color: 'nexagen-green'
        },
        {
            name: 'GracyAI',
            tagline: 'Your Intelligent Campus Sidekick.',
            description: 'An advanced AI assistant that handles everything from academic queries to administrative support. Available 24/7 to ensure students never feel lost.',
            icon: Cpu,
            features: ['Natural language processing', 'Automated course lookups', 'Instant administrative help', 'Smart reminders'],
            color: 'nexagen-blue'
        }
    ];

    return (
        <div className="pb-24">
{/* Header */}
            <section className="nexagen-bg-overlay text-white py-32 px-6 overflow-hidden relative">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                            <img src="/nexagen.jpeg" alt="NexaGen" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Ecosystem</h1>
                    <p className="text-xl text-gray-200 max-w-2xl">
                        We build software that solves real campus problems. From communication to AI-driven automation, our products are the backbone of the modern student experience.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform origin-top-right" />
            </section>

            {/* Grid */}
            <section className="max-w-7xl mx-auto px-6 -mt-16">
                <div className="grid grid-cols-1 gap-12">
                    {products.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                        >
                            <GlassCard className="p-12 overflow-hidden relative">
                                <div className={`absolute top-0 right-0 w-64 h-64 bg-${p.color}/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl`} />

                                <div className="flex flex-col lg:flex-row items-center gap-16">
                                    <div className="lg:w-1/2 space-y-8">
                                        <div className="inline-flex items-center space-x-2 text-nexagen-accent font-bold">
                                            <Sparkles size={20} />
                                            <span className="uppercase tracking-widest text-sm">{p.tagline}</span>
                                        </div>
                                        <h2 className={`text-5xl font-extrabold text-${p.color}`}>{p.name}</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">{p.description}</p>

                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {p.features.map((f, fi) => (
                                                <li key={fi} className="flex items-center space-x-3 text-gray-700">
                                                    <Zap size={18} className="text-nexagen-gold" />
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="flex gap-4 pt-4">
                                            <Button variant="primary" size="lg">
                                                <Download className="mr-2 w-5 h-5" /> Download App
                                            </Button>
                                            <Button variant="outline" size="lg">Documentation</Button>
                                        </div>
                                    </div>

                                    <div className="lg:w-1/2">
                                        <div className="relative p-8 glass rounded-[3rem] shadow-2xl border-white/40">
                                            <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-bold overflow-hidden">
                                                {/* Product Interface Mockup Placeholder */}
                                                <img
                                                    src={i === 0 ? "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800" : "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};
