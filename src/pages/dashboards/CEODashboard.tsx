import React from 'react';
import { GlassCard } from '../../components/shared/GlassCard';
import { Users, Activity, Zap } from 'lucide-react';

export const CEODashboard: React.FC = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-nexagen-dark">CEO Strategic Overview</h1>
                    <p className="text-gray-500">Welcome back, Gregory Steve.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Analytics */}
                <GlassCard className="lg:col-span-2 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-xl">Operational Health</h3>
                        <div className="flex items-center space-x-2 text-green-500 text-sm font-bold">
                            <Activity size={16} />
                            <span>Optimized</span>
                        </div>
                    </div>
                    <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-bold border-2 border-dashed">
                        Real-time User Growth Waveform (Placeholder)
                    </div>
                </GlassCard>

                {/* Priority Comms */}
                <div className="space-y-6">
                    <GlassCard className="p-6 premium-gradient text-white">
                        <Zap className="mb-4 text-nexagen-gold" />
                        <h4 className="font-bold text-lg mb-2">Priority Messages</h4>
                        <p className="text-gray-200 text-sm mb-4">You have 0 urgent queries from partners.</p>
                    </GlassCard>
                    <GlassCard className="p-6">
                        <Users className="mb-4 text-nexagen-blue" />
                        <h4 className="font-bold text-lg mb-2">Meeting Invites</h4>
                        <p className="text-gray-500 text-sm">No confirmed bookings for today.</p>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};
