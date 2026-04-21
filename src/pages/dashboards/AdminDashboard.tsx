import React, { useEffect, useState } from 'react';
import { GlassCard } from '../../components/shared/GlassCard';
import { supabase } from '../../lib/supabase';
import { Mail, Calendar, Star, DollarSign, Loader2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({ requests: 0, bookings: 0, reviews: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const { count: reqCount } = await supabase.from('requests').select('*', { count: 'exact', head: true });
            const { count: bookCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
            const { count: revCount } = await supabase.from('reviews').select('*', { count: 'exact', head: true });

            setStats({
                requests: reqCount || 0,
                bookings: bookCount || 0,
                reviews: revCount || 0
            });
            setLoading(false);
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Requests', value: stats.requests, icon: Mail, color: 'text-blue-500' },
        { title: 'Active Bookings', value: stats.bookings, icon: Calendar, color: 'text-green-500' },
        { title: 'User Reviews', value: stats.reviews, icon: Star, color: 'text-yellow-500' },
        { title: 'Total Donations', value: '$0.00', icon: DollarSign, color: 'text-purple-500' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-nexagen-dark mb-8">Admin Command Center</h1>

            {loading ? (
                <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-nexagen-green" size={40} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {cards.map((card, i) => (
                        <GlassCard key={i} className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg bg-gray-50 ${card.color}`}>
                                    <card.icon size={24} />
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                            <h3 className="text-2xl font-bold text-nexagen-dark">{card.value}</h3>
                        </GlassCard>
                    ))}
                </div>
            )}

            {/* Recent Activity Placeholder */}
            <GlassCard className="p-8">
                <h3 className="text-xl font-bold mb-6">Recent Requests</h3>
                <div className="text-gray-400 text-center py-10">No recent activity found in the database.</div>
            </GlassCard>
        </div>
    );
};
