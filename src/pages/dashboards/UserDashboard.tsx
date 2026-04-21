import React from 'react';
import { useRequests, useBookings } from '../../hooks/useAdminData';
import { GlassCard } from '../../components/shared/GlassCard';
import { MessageSquare, Calendar, Star, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const UserDashboard: React.FC = () => {
    const { requests, loading: reqLoading } = useRequests();
    const { bookings, loading: bookLoading } = useBookings();

    const loading = reqLoading || bookLoading;

    // Mocking "current user" filtering for now
    // In a real app, we'd use supabase.auth.getUser() and filter by email/uid
    const myRequests = requests.slice(0, 3);
    const myBookings = bookings.slice(0, 2);

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-nexagen-green" size={40} /></div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">My NexaGen Activity</h1>
                <p className="text-gray-500 text-sm">Track your progress and booked sessions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Requests */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-nexagen-blue mb-2">
                        <MessageSquare size={18} />
                        <h3 className="font-bold">Recent Requests</h3>
                    </div>
                    {myRequests.map(req => (
                        <GlassCard key={req.id} className="p-4 flex items-center justify-between border-gray-100 shadow-sm">
                            <div>
                                <p className="text-sm font-bold text-gray-800">{req.subject}</p>
                                <p className="text-xs text-gray-400">{new Date(req.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={cn(
                                "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                                req.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            )}>
                                {req.status}
                            </span>
                        </GlassCard>
                    ))}
                    {myRequests.length === 0 && <div className="p-8 text-center text-gray-400 text-sm border-2 border-dashed border-gray-50 rounded-2xl">No active requests</div>}
                </div>

                {/* Booked Sessions */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-nexagen-green mb-2">
                        <Calendar size={18} />
                        <h3 className="font-bold">Upcoming Bookings</h3>
                    </div>
                    {myBookings.map(book => (
                        <GlassCard key={book.id} className="p-4 flex items-center space-x-4 border-gray-100 shadow-sm">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400">
                                <span className="text-[10px] font-bold uppercase">{new Date(book.scheduled_at).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-lg font-extrabold text-nexagen-dark">{new Date(book.scheduled_at).getDate()}</span>
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm font-bold text-gray-800 capitalize">{book.session_type}</p>
                                <p className="text-xs text-gray-400 flex items-center">
                                    <Clock size={12} className="mr-1" />
                                    {new Date(book.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            {book.status === 'confirmed' && <CheckCircle size={18} className="text-green-500" />}
                        </GlassCard>
                    ))}
                    {myBookings.length === 0 && <div className="p-8 text-center text-gray-400 text-sm border-2 border-dashed border-gray-50 rounded-2xl">No upcoming sessions</div>}
                </div>
            </div>

            {/* Rewards/Profile Summary */}
            <GlassCard className="p-8 premium-gradient text-white flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-6 md:mb-0">
                    <h3 className="text-xl font-bold mb-2">Build Together Program</h3>
                    <p className="text-white/70 text-sm">You are 1 session away from unlocking "Founder Collaboration" status.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-nexagen-gold/20 flex items-center justify-center">
                                <Star size={16} className="text-nexagen-gold fill-nexagen-gold" />
                            </div>
                        ))}
                    </div>
                    <button className="px-6 py-2 bg-white text-nexagen-dark text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors">
                        View Rewards
                    </button>
                </div>
            </GlassCard>
        </div>
    );
};
