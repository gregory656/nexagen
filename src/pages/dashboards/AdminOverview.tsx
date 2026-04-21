import React from 'react';
import { useMetrics, useRequests } from '../../hooks/useAdminData';
import { GlassCard } from '../../components/shared/GlassCard';
import { Users, TrendingUp, Landmark, Mail, AlertCircle, Loader2 } from 'lucide-react';

export const AdminOverview: React.FC = () => {
    const { metrics, loading: metricsLoading } = useMetrics();
    const { requests, loading: reqLoading } = useRequests();

    const loading = metricsLoading || reqLoading;

    const totalRequests = requests.length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;

    const getMetricValue = (name: string) => {
        return metrics.find(m => m.name === name)?.value || 0;
    };

    const cards = [
        { title: 'Monthly Users', value: getMetricValue('monthly_users'), icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Revenue', value: `$${getMetricValue('revenue')}`, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
        { title: 'Campuses', value: getMetricValue('campuses'), icon: Landmark, color: 'text-yellow-500', bg: 'bg-yellow-50' },
        { title: 'Total Requests', value: totalRequests, icon: Mail, color: 'text-purple-500', bg: 'bg-purple-50' },
        { title: 'Pending Requests', value: pendingRequests, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
    ];

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-nexagen-green" size={40} /></div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500 text-sm">Real-time metrics from Supabase</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {cards.map((card, i) => (
                    <GlassCard key={i} className="p-6 flex flex-col justify-between border-none shadow-sm">
                        <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center ${card.color} mb-4`}>
                            <card.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{card.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <GlassCard className="lg:col-span-2 p-8">
                    <h3 className="font-bold text-lg mb-6">Recent Activity Trend</h3>
                    <div className="h-64 bg-gray-50/50 rounded-2xl flex items-center justify-center text-gray-400 text-sm font-medium border-2 border-dashed border-gray-100">
                        Activity Chart Placeholder
                    </div>
                </GlassCard>
                <GlassCard className="p-8">
                    <h3 className="font-bold text-lg mb-6">Request Distribution</h3>
                    <div className="space-y-4">
                        {['Quote', 'Support', 'Collaboration', 'General'].map(type => {
                            const count = requests.filter(r => r.type === type).length;
                            const percent = totalRequests ? (count / totalRequests) * 100 : 0;
                            return (
                                <div key={type}>
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span className="text-gray-600">{type}</span>
                                        <span className="text-gray-400">{count}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-nexagen-green transition-all" style={{ width: `${percent}%` }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
