import React from 'react';
import { useBookings } from '../../hooks/useAdminData';
import { GlassCard } from '../../components/shared/GlassCard';
import { Check, X, Calendar, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AdminBookings: React.FC = () => {
    const { bookings, loading, updateStatus } = useBookings();

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-nexagen-green" size={40} /></div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
                <p className="text-gray-500 text-sm">Schedule management for CEO consultations</p>
            </div>

            <GlassCard className="p-0 overflow-hidden border-none shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8FAFC] border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Session Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Scheduled At</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-nexagen-green/10 rounded-lg text-nexagen-green">
                                                <Calendar size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-800 capitalize">{booking.session_type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                                        {new Date(booking.scheduled_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase", getStatusStyle(booking.status))}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(booking.id, 'confirmed')}
                                                        className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg"
                                                        title="Confirm Booking"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(booking.id, 'cancelled')}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                                        title="Cancel Booking"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-gray-400 italic">No bookings found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};
