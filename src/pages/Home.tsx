import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, TrendingUp, Landmark, Cpu, Cloud } from 'lucide-react';
import { Button } from '../components/shared/Button';
import { GlassCard } from '../components/shared/GlassCard';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export const Home: React.FC = () => {
    const metrics = [
        { name: 'Monthly Users', value: '12,000+', icon: Users, color: 'text-blue-500' },
        { name: 'Revenue', value: '$4,500+', icon: TrendingUp, color: 'text-green-500' },
        { name: 'Campuses', value: '8', icon: Landmark, color: 'text-yellow-500' },
    ];

    const products = [
        {
            name: 'Gracy Chat',
            description: 'Campus-based communication platform for seamless student interactions.',
            icon: Cloud,
            link: '/products',
        },
        {
            name: 'GracyAI',
            description: 'AI assistant for smart campus interaction and instant query resolution.',
            icon: Cpu,
            link: '/products',
        },
    ];

    const stakeholders = [
        { name: 'TopHeights Electricals', desc: 'Infrastructure partner' },
        { name: 'GoodX', desc: 'Innovation collaborator' },
        { name: 'Zeraki', desc: 'Education technology partner' },
    ];

    return (
        <div className="space-y-24 pb-24">
{/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden px-6 nexagen-hero-bg">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nexagen-green/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-nexagen-blue/20 rounded-full blur-[120px] animate-pulse delay-700" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center max-w-4xl"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block px-4 py-1.5 glass rounded-full text-nexagen-green text-sm font-bold mb-6"
                    >
                        🚀 Powered by Gracy
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-nexagen-dark mb-6 leading-tight">
                        The Future of <span className="text-nexagen-green">Campus Technology</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        NexaGen is revolutionizing how campuses interact, communicate, and grow through smart AI-driven solutions.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/contact">
                            <Button size="lg" variant="primary" className="shadow-xl shadow-nexagen-green/20">
                                Request a Quote <ArrowRight className="inline-block ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link to="/talk-to-ceo">
                            <Button size="lg" variant="outline">
                                Talk to CEO
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Metrics Section */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {metrics.map((metric, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <GlassCard className="text-center group border-b-4 border-b-transparent hover:border-b-nexagen-accent">
                                <div className={cn("inline-flex p-3 rounded-2xl bg-white mb-4 shadow-sm transition-transform group-hover:scale-110", metric.color)}>
                                    <metric.icon size={28} />
                                </div>
                                <h3 className="text-4xl font-bold text-nexagen-dark mb-1">{metric.value}</h3>
                                <p className="text-gray-500 font-medium">{metric.name}</p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Products Section */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-nexagen-dark mb-4">Our Flagship Products</h2>
                    <p className="text-gray-600">Built to scale. Designed for students.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {products.map((product, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <GlassCard className="h-full flex flex-col items-start space-y-6 hover:-translate-y-2 transition-transform duration-500">
                                <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center text-white">
                                    <product.icon size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-nexagen-green mb-3">{product.name}</h3>
                                    <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
                                    <Link to={product.link}>
                                        <Button variant="ghost" className="px-0 hover:translate-x-2">
                                            Learn More <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Stakeholders Section */}
            <section className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="md:w-1/3">
                            <h2 className="text-4xl font-bold text-nexagen-dark mb-6">Our Partners & Stakeholders</h2>
                            <p className="text-gray-600">Working with the best to deliver excellence across the board.</p>
                        </div>
                        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {stakeholders.map((s, idx) => (
                                <div key={idx} className="p-6 border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow bg-gray-50/50">
                                    <div className="w-12 h-12 bg-white rounded-lg mb-4 flex items-center justify-center font-bold text-nexagen-blue shadow-sm">
                                        {s.name.charAt(0)}
                                    </div>
                                    <h4 className="font-bold text-nexagen-dark mb-1">{s.name}</h4>
                                    <p className="text-xs text-gray-500">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
