import { useState, useEffect } from 'react';
import axiosService from '../services/axiosService';

// Custom hook for fetching data automatically from an API
export const useFetch = <T = unknown>(baseUrl: string, params = {}) => {
    
    const VITE_API_URL = import.meta.env.VITE_NEST_API_URL;

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (baseUrl === "") return;

            setLoading(true);
            try {
                const response = await axiosService.get(`${VITE_API_URL}${baseUrl}`, params);
                setData(response.data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error(String(err)));
                console.error('Error fetching data:', err instanceof Error ? err.message : err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [baseUrl, JSON.stringify(params)]);

    return { data, loading, error };
};