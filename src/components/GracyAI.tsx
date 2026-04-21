import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Cpu } from 'lucide-react';
import { Button } from './shared/Button';
import { GlassCard } from './shared/GlassCard';

export const GracyAI: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: 'Hi! I am Gracy, your NexaGen assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text: input }]);
        const userMsg = input.toLowerCase();
        setInput('');

        // Basic Q&A Logic
        setTimeout(() => {
            let response = "I'm not sure about that, but I can help you contact Gregory Steve if you'd like!";
            if (userMsg.includes('products')) response = "NexaGen offers Gracy Chat and GracyAI. You can find more details on our Products page!";
            if (userMsg.includes('who are you')) response = "I'm GracyAI, the flagship AI assistant for NexaGen Technology.";
            if (userMsg.includes('founder') || userMsg.includes('gregory')) response = "Gregory Steve is the visionary founder of NexaGen. He's passionate about campus technology!";
            if (userMsg.includes('contact')) response = "You can reach us at nexagen656@gmail.com or via the Contact page.";

            setMessages(prev => [...prev, { role: 'ai', text: response }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[350px] md:w-[400px]"
                    >
                        <GlassCard className="p-0 overflow-hidden shadow-2xl border-nexagen-green/20">
                            {/* Header */}
                            <div className="premium-gradient p-4 text-white flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                        <Cpu size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">GracyAI Assistant</h4>
                                        <span className="text-[10px] text-gray-200">Online & Ready</span>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Messages */}
                            <div ref={scrollRef} className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user'
                                            ? 'bg-nexagen-blue text-white rounded-br-none'
                                            : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none'
                                            }`}>
                                            {m.text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-gray-100 bg-white flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="Ask Gracy anything..."
                                    className="flex-grow text-sm outline-none px-2 py-1"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                    onClick={handleSend}
                                    className="p-2 bg-nexagen-green text-white rounded-lg hover:bg-nexagen-dark transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="primary"
                className="w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center p-0"
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </Button>
        </div>
    );
};
