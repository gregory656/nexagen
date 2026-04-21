import React, { useState } from 'react';
import { Send, Mail, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../components/shared/Button';
import { GlassCard } from '../components/shared/GlassCard';
import { supabase } from '../lib/supabase';

export const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: 'general',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const { error } = await supabase
                .from('requests')
                .insert([
                    {
                        type: formData.type,
                        subject: formData.subject,
                        message: `From: ${formData.name} <${formData.email}>\n\n${formData.message}`,
                        status: 'pending'
                    }
                ]);

            if (error) throw error;
            setStatus('success');
            setFormData({ name: '', email: '', type: 'general', subject: '', message: '' });
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div className="pb-24">
            {/* Header */}
            <section className="py-24 px-6 text-center">
                <h1 className="text-5xl font-bold text-nexagen-dark mb-4">Get in Touch</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Whether you want a quote, need support, or just want to say hi, our team is ready to listen.
                </p>
            </section>

            <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <GlassCard className="p-8 space-y-6">
                        <h3 className="text-2xl font-bold text-nexagen-green mb-6">Contact Details</h3>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-nexagen-green/10 rounded-xl flex items-center justify-center text-nexagen-green">
                                <Phone size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium">Call Us</p>
                                <p className="text-gray-700 font-bold">+254719637416</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-nexagen-blue/10 rounded-xl flex items-center justify-center text-nexagen-blue">
                                <Mail size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium">Email Us</p>
                                <p className="text-gray-700 font-bold">nexagen656@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-nexagen-gold/10 rounded-xl flex items-center justify-center text-nexagen-gold">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium">Headquarters</p>
                                <p className="text-gray-700 font-bold">Nairobi, Kenya</p>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-8 bg-nexagen-dark text-white">
                        <h4 className="text-lg font-bold mb-4">Support Hours</h4>
                        <div className="space-y-2 text-sm text-gray-400">
                            <div className="flex justify-between">
                                <span>Monday - Friday</span>
                                <span>8:00 AM - 6:00 PM</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Saturday</span>
                                <span>9:00 AM - 2:00 PM</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Sunday</span>
                                <span className="text-nexagen-gold">Closed</span>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Form */}
                <div className="lg:col-span-2">
                    <GlassCard className="p-10">
                        {status === 'success' ? (
                            <div className="text-center py-20 space-y-6">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h3 className="text-3xl font-bold text-nexagen-dark">Request Sent!</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">Thank you for reaching out. Gregory Steve or our team will get back to you shortly.</p>
                                <Button onClick={() => setStatus('idle')} variant="outline">Send Another Message</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-nexagen-green/20 outline-none transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-nexagen-green/20 outline-none transition-all"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Request Type</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-nexagen-green/20 outline-none transition-all"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="quote">Request a Quote</option>
                                            <option value="support">Product Support</option>
                                            <option value="collaboration">Collaboration</option>
                                            <option value="general">General Inquiry</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Subject</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="How can we help?"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-nexagen-green/20 outline-none transition-all"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Message</label>
                                    <textarea
                                        required
                                        rows={6}
                                        placeholder="Tell us more about your project or inquiry..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-nexagen-green/20 outline-none transition-all resize-none"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                {status === 'error' && (
                                    <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-4 rounded-xl">
                                        <AlertCircle size={20} />
                                        <span>Failed to send message. Please try again.</span>
                                    </div>
                                )}

                                <Button
                                    disabled={status === 'loading'}
                                    type="submit"
                                    size="lg"
                                    variant="primary"
                                    className="w-full md:w-auto"
                                >
                                    {status === 'loading' ? 'Sending...' : 'Send Message'} <Send className="ml-2 w-5 h-5" />
                                </Button>
                            </form>
                        )}
                    </GlassCard>
                </div>
            </section>
        </div>
    );
};
