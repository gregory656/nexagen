import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Code, Globe, FlaskConical, Briefcase } from 'lucide-react';
import { GlassCard } from '../components/shared/GlassCard';
import { Button } from '../components/shared/Button';

export const Projects: React.FC = () => {
    const projects = [
        {
            title: 'EduSync Portal',
            category: 'Internal',
            desc: 'Centralized dashboard for campus administrative staff to manage student data and feedback.',
            tech: ['React', 'Supabase', 'Tailwind'],
            type: 'internal'
        },
        {
            title: 'SmartCampus IoT',
            category: 'Experimental',
            desc: 'Real-time monitoring of campus utilities and facility usage using IoT sensors and NexaGen backend.',
            tech: ['Node.js', 'MQTT', 'React'],
            type: 'experimental'
        },
        {
            title: 'TopHeights E-Store',
            category: 'Client',
            desc: 'Full-featured e-commerce platform built for TopHeights Electricals with custom inventory tracking.',
            tech: ['Next.js', 'Prisma', 'Stripe'],
            type: 'client'
        }
    ];

    return (
        <div className="pb-24">
            {/* Header */}
            <section className="py-24 px-6 text-center">
                <h1 className="text-5xl font-bold text-nexagen-dark mb-4">Our Portfolio</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    A showcase of our internal tools, client partnerships, and experimental research projects.
                </p>
            </section>

            {/* filter tags placeholder */}
            <div className="flex justify-center gap-4 mb-16">
                {['All', 'Internal', 'Client', 'Experimental'].map((t) => (
                    <button key={t} className="px-6 py-2 rounded-full border border-gray-200 text-sm font-medium hover:bg-nexagen-green hover:text-white transition-all">
                        {t}
                    </button>
                ))}
            </div>

            {/* Project Grid */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {projects.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <GlassCard className="h-full flex flex-col justify-between group overflow-hidden">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-white rounded-xl shadow-sm">
                                        {p.type === 'internal' && <Code className="text-nexagen-green" />}
                                        {p.type === 'client' && <Briefcase className="text-nexagen-blue" />}
                                        {p.type === 'experimental' && <FlaskConical className="text-nexagen-accent" />}
                                    </div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-gray-100 rounded-full text-gray-500">
                                        {p.category}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-nexagen-dark mb-3 group-hover:text-nexagen-green transition-colors">{p.title}</h3>
                                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                        {p.desc}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {p.tech.map((t) => (
                                            <span key={t} className="text-[10px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded border border-gray-100">{t}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                    <Button variant="ghost" size="sm" className="px-0">
                                        <Globe className="mr-2 w-4 h-4" /> Live Demo
                                    </Button>
                                    <Button variant="ghost" size="sm" className="px-0">
                                        <Code2 className="mr-2 w-4 h-4" /> Source Code
                                    </Button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Box */}
            <section className="max-w-7xl mx-auto px-6 mt-24">
                <div className="premium-gradient rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-6">Have a project in mind?</h2>
                        <p className="text-gray-200 mb-10 max-w-xl mx-auto">We are always open to new collaborations and experimental ventures. Let's build something together.</p>
                        <Button variant="gold" size="lg">Start a Partnership</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
