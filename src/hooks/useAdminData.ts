import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type MetricRecord = {
    id?: string;
    name: string;
    value: string | number;
};

type RequestRecord = {
    id: string;
    type: string;
    subject: string;
    status: string;
    created_at: string;
};

type BookingRecord = {
    id: string;
    session_type: string;
    scheduled_at: string;
    status: string;
};

export function useMetrics() {
    const [metrics, setMetrics] = useState<MetricRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMetrics() {
            const { data } = await supabase.from('metrics').select('*');
            setMetrics(data || []);
            setLoading(false);
        }
        fetchMetrics();
    }, []);

    return { metrics, loading };
}

export function useRequests() {
    const [requests, setRequests] = useState<RequestRecord[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchRequests() {
        setLoading(true);
        const { data } = await supabase
            .from('requests')
            .select('*')
            .order('created_at', { ascending: false });
        setRequests(data || []);
        setLoading(false);
    }

    useEffect(() => {
        void Promise.resolve().then(fetchRequests);
    }, []);

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from('requests')
            .update({ status })
            .eq('id', id);
        if (!error) fetchRequests();
        return { error };
    };

    return { requests, loading, updateStatus, refresh: fetchRequests };
}

export function useBookings() {
    const [bookings, setBookings] = useState<BookingRecord[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchBookings() {
        const { data } = await supabase
            .from('bookings')
            .select('*')
            .order('scheduled_at', { ascending: true });
        setBookings(data || []);
        setLoading(false);
    }

    useEffect(() => {
        void Promise.resolve().then(fetchBookings);
    }, []);

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', id);
        if (!error) fetchBookings();
        return { error };
    };

    return { bookings, loading, updateStatus };
}
