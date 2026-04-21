import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Award, Users, Rocket } from 'lucide-react';
import { GlassCard } from '../components/shared/GlassCard';

export const About: React.FC = () => {
    const values = [
        { title: 'Innovation', desc: 'Pushing boundaries in campus tech.', icon: Rocket },
        { title: 'Community', desc: 'Building seamless connections for students.', icon: Users },
        { title: 'Excellence', desc: 'Delivering premium software experiences.', icon: Award },
    ];

    return (
        <div className="pb-24">
            {/* Hero */}
            <section className="bg-nexagen-dark text-white py-24 px-6 text-center">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-5xl md:text-6xl font-bold mb-6"
                >
                    Our Story
                </motion.h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    NexaGen was born from a simple idea: that technology should bridge the gap between campus administration and student life.
                </p>
            </section>

            {/* Mission & Vision */}
            <section className="max-w-7xl mx-auto px-6 -mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <GlassCard className="flex flex-col items-center text-center p-12">
                        <div className="w-16 h-16 bg-nexagen-green/10 rounded-full flex items-center justify-center text-nexagen-green mb-6">
                            <Target size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-nexagen-dark mb-4">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To empower African educational institutions with world-class technology that simplifies communication and enhances academic experiences.
                        </p>
                    </GlassCard>
                    <GlassCard className="flex flex-col items-center text-center p-12">
                        <div className="w-16 h-16 bg-nexagen-blue/10 rounded-full flex items-center justify-center text-nexagen-blue mb-6">
                            <Eye size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-nexagen-dark mb-4">Our Vision</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To be the leading provider of intelligent campus solutions across the continent, setting the standard for smart educational ecosystems.
                        </p>
                    </GlassCard>
                </div>
            </section>

            {/* Founder Section */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2 relative">
                        <div className="absolute inset-0 bg-nexagen-gold/20 rounded-[2rem] rotate-3 translate-x-4 translate-y-4" />
                        <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
                            alt="Gregory Steve"
                            className="relative z-10 w-full h-[500px] object-cover rounded-[2rem] shadow-2xl"
                        />
                    </div>
                    <div className="md:w-1/2 space-y-8">
                        <div className="inline-block px-4 py-1 bg-nexagen-gold text-nexagen-dark font-bold text-sm rounded-lg">Founder & CEO</div>
                        <h2 className="text-4xl font-extrabold text-nexagen-dark">Gregory Steve</h2>
                        <p className="text-gray-600 text-lg leading-relaxed italic">
                            "Technology is not just many lines of code; it's a tool for transformation. At NexaGen, we don't just build software, we build the future of campus life."
                        </p>
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                Gregory is a visionary technologist with a passion for educational technology and student welfare. Under his leadership, NexaGen has grown from a campus startup to a regional innovator.
                            </p>
                        </div>
                        <div className="flex space-x-12 pt-4">
                            <div>
                                <h4 className="text-3xl font-bold text-nexagen-green">5+</h4>
                                <p className="text-gray-500 text-sm">Years Exp.</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-nexagen-blue">10+</h4>
                                <p className="text-gray-500 text-sm">Projects</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-nexagen-dark text-center mb-16">What Drives Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((v, i) => (
                            <div key={i} className="text-center p-8">
                                <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center text-nexagen-accent mb-6 transform transition-transform hover:rotate-12">
                                    <v.icon size={28} />
                                </div>
                                <h4 className="text-xl font-bold text-nexagen-dark mb-3">{v.title}</h4>
                                <p className="text-gray-500">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
