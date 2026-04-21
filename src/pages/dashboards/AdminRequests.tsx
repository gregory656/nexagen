import React from 'react';
import { useRequests } from '../../hooks/useAdminData';
import { GlassCard } from '../../components/shared/GlassCard';
import { RefreshCw, CheckCircle2, PlayCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AdminRequests: React.FC = () => {
    const { requests, loading, updateStatus, refresh } = useRequests();

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'in_progress': return 'bg-blue-100 text-blue-700';
            case 'resolved': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-nexagen-green" size={40} /></div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">User Requests</h1>
                    <p className="text-gray-500 text-sm">Manage quote requests and support tickets</p>
                </div>
                <button
                    onClick={refresh}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            <GlassCard className="p-0 overflow-hidden border-none shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8FAFC] border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-nexagen-blue capitalize">{req.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-800 font-medium truncate max-w-xs">{req.subject}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase", getStatusStyle(req.status))}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {new Date(req.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {req.status === 'pending' && (
                                                <button
                                                    onClick={() => updateStatus(req.id, 'in_progress')}
                                                    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"
                                                    title="Set In Progress"
                                                >
                                                    <PlayCircle size={18} />
                                                </button>
                                            )}
                                            {req.status !== 'resolved' && (
                                                <button
                                                    onClick={() => updateStatus(req.id, 'resolved')}
                                                    className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg"
                                                    title="Mark Resolved"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic">No requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};
