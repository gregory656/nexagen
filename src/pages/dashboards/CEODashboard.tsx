import React from 'react';
import { useMetrics, useRequests } from '../../hooks/useAdminData';
import { GlassCard } from '../../components/shared/GlassCard';
import { Activity, Zap, TrendingUp, Users, Target, Loader2 } from 'lucide-react';

export const CEODashboard: React.FC = () => {
    const { metrics, loading: metricsLoading } = useMetrics();
    const { requests, loading: reqLoading } = useRequests();

    const loading = metricsLoading || reqLoading;

    const revenue = metrics.find(m => m.name === 'revenue')?.value || 0;
    const users = metrics.find(m => m.name === 'monthly_users')?.value || 0;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-nexagen-green" size={40} /></div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">CEO Strategic Overview</h1>
                    <p className="text-gray-500 text-sm italic">Focusing on long-term growth and operational excellence</p>
                </div>
                <div className="flex items-center space-x-2 text-green-500 text-sm font-bold bg-green-50 px-4 py-2 rounded-lg">
                    <Activity size={16} />
                    <span>System Healthy</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Key Drivers */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GlassCard className="p-8 premium-gradient text-white border-none">
                        <h4 className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">Total Yield</h4>
                        <h3 className="text-4xl font-bold mb-4">${revenue.toLocaleString()}</h3>
                        <div className="flex items-center space-x-2 text-green-300 text-sm font-bold">
                            <TrendingUp size={16} />
                            <span>+12.5% this month</span>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-8 bg-nexagen-dark text-white border-none">
                        <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Market Reach</h4>
                        <h3 className="text-4xl font-bold mb-4">{users.toLocaleString()}</h3>
                        <div className="flex items-center space-x-2 text-nexagen-gold text-sm font-bold">
                            <Users size={16} />
                            <span>Campus Adoption High</span>
                        </div>
                    </GlassCard>

                    <GlassCard className="md:col-span-2 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-bold">Growth Projection</h4>
                            <button className="text-xs text-nexagen-green font-bold hover:underline">Download Report</button>
                        </div>
                        <div className="h-40 bg-gray-50/50 rounded-2xl flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-100">
                            Interactive Growth Curve (Placeholder)
                        </div>
                    </GlassCard>
                </div>

                {/* Priority Focus */}
                <div className="space-y-6">
                    <GlassCard className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                                <Zap size={18} />
                            </div>
                            <h4 className="font-bold">Critical Comms</h4>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">You have <span className="text-nexagen-blue font-bold">{pendingRequests}</span> pending partner inquiries requiring review.</p>
                        <button className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-bold rounded-lg transition-colors">
                            Open Inbox
                        </button>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-yellow-50 text-yellow-500 rounded-lg">
                                <Target size={18} />
                            </div>
                            <h4 className="font-bold">Quarterly Target</h4>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full mb-2 overflow-hidden">
                            <div className="h-full bg-nexagen-gold w-[75%]" />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                            <span>Progress</span>
                            <span>75%</span>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};
