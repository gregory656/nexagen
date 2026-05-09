import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from './shared/Button';
import { GlassCard } from './shared/GlassCard';
import { supabase } from '../lib/supabase';

type ChatMessage = { role: 'user' | 'ai'; text: string };

export const GracyAI: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'ai', text: 'Hi! I am Gracy, your NexaGen assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const nextMessages: ChatMessage[] = [...messages, { role: 'user', text: input }];
        setMessages(nextMessages);
        const userMsg = input.toLowerCase();
        setInput('');
        setLoading(true);

        try {
            const { data, error } = await supabase.functions.invoke<{ reply?: string; error?: string }>('chat-assistant', {
                body: {
                    messages: nextMessages.map((message) => ({
                        role: message.role === 'ai' ? 'assistant' : 'user',
                        content: message.text,
                    })),
                },
            });
            if (error || data?.error) throw new Error(data?.error ?? error?.message ?? 'Chat assistant is unavailable.');
            setMessages(prev => [...prev, { role: 'ai', text: data?.reply ?? fallbackReply(userMsg) }]);
        } catch (error) {
            const helper = error instanceof Error && error.message.toLowerCase().includes('openai')
                ? 'OpenAI is not configured yet. Add OPENAI_API_KEY as a Supabase secret, then deploy the chat-assistant function.'
                : fallbackReply(userMsg);
            setMessages(prev => [...prev, { role: 'ai', text: helper }]);
        } finally {
            setLoading(false);
        }
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
                            <div className="nexagen-bg-overlay p-4 text-white flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                                        <img src="/nexagen.jpeg" alt="NexaGen" className="w-full h-full object-cover" />
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
                                            <MessageText text={m.text} />
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="rounded-2xl rounded-bl-none border border-gray-100 bg-white p-3 text-sm text-gray-500 shadow-sm">
                                            <span className="inline-flex items-center gap-1">
                                                <span className="h-2 w-2 animate-bounce rounded-full bg-nexagen-green" />
                                                <span className="h-2 w-2 animate-bounce rounded-full bg-nexagen-blue [animation-delay:120ms]" />
                                                <span className="h-2 w-2 animate-bounce rounded-full bg-nexagen-gold [animation-delay:240ms]" />
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-gray-100 bg-white flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="Ask Gracy anything..."
                                    className="flex-grow text-sm outline-none px-2 py-1"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && void handleSend()}
                                />
                                <button
                                    onClick={() => void handleSend()}
                                    disabled={loading}
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

function fallbackReply(userMsg: string) {
    if (userMsg.includes('products')) return 'NexaGen offers learning dashboards, GracyAI support, coding practice, and SaaS subscription tools.';
    if (userMsg.includes('pay') || userMsg.includes('subscription')) return 'Choose a plan, enter your M-Pesa number, approve the STK Push, and NexaGen will unlock access after confirmation.';
    if (userMsg.includes('contact')) return 'You can reach NexaGen at nexagen656@gmail.com or use the Contact page.';
    return 'I can help with NexaGen onboarding, subscriptions, coding practice, dashboards, and support.';
}

function MessageText({ text }: { text: string }) {
    return (
        <span className="whitespace-pre-wrap">
            {text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
                return <React.Fragment key={index}>{part}</React.Fragment>;
            })}
        </span>
    );
}
