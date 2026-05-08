import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { GlassCard } from '../../components/shared/GlassCard';
import { Star, MessageCircle, Loader2 } from 'lucide-react';

type Review = {
    id: string;
    rating: number;
    comment?: string;
    created_at: string;
};

export const AdminReviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReviews() {
            const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
            setReviews(data || []);
            setLoading(false);
        }
        fetchReviews();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-nexagen-green" size={40} /></div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">User Reviews</h1>
                <p className="text-gray-500 text-sm">Feedback and ratings from your customers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((rev) => (
                    <GlassCard key={rev.id} className="p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center space-x-1 text-nexagen-gold mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < rev.rating ? 'currentColor' : 'none'} strokeWidth={2} />
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm italic mb-6">"{rev.comment}"</p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(rev.created_at).toLocaleDateString()}</span>
                            <MessageCircle size={14} className="text-gray-300" />
                        </div>
                    </GlassCard>
                ))}
                {reviews.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-400 italic">No reviews yet.</div>
                )}
            </div>
        </div>
    );
};
