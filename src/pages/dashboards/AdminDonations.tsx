import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { GlassCard } from '../../components/shared/GlassCard';
import { DollarSign, CreditCard, Loader2 } from 'lucide-react';

export const AdminDonations: React.FC = () => {
    const [donations, setDonations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDonations() {
            const { data } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
            setDonations(data || []);
            setLoading(false);
        }
        fetchDonations();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-nexagen-green" size={40} /></div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Donations</h1>
                <p className="text-gray-500 text-sm">Contributions from supporters and partners</p>
            </div>

            <GlassCard className="p-0 overflow-hidden border-none shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8FAFC] border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {donations.map((d) => (
                                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-nexagen-green font-bold">
                                            <DollarSign size={14} />
                                            <span>{Number(d.amount).toFixed(2)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-gray-600 text-xs font-medium">
                                            <CreditCard size={14} />
                                            <span className="capitalize">{d.method}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${d.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {d.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-400 text-sm">
                                        {new Date(d.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {donations.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-gray-400 italic">No donations found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};
