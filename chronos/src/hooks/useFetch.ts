import { useState, useEffect } from 'react';
import axiosService from '../services/axiosService';

export const useFetch = <T = unknown>(url: string, params = {}) => {
    const [data, setData] = useState<T | null>(null);
    const [config, setConfig] = useState<any>(null);
    const [method, setMethod] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const httpConfig = (method: string, config: any) => {
        setMethod(method);
        setConfig(config);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (url === "") return;

            setLoading(true);
            try {
                const response = await axiosService.get(url, params);
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
    }, [url, JSON.stringify(params)]);

    useEffect(() => {
        const httpRequest = async () => {
            if (!method || !config) return;

            setLoading(true);
            setError(null);

            try {
                if (method === "POST") {
                    const response = await axiosService.post(url, config);
                    setData(response.data);
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error(String(err)));
                console.error('Error on manual http request:', err instanceof Error ? err.message : err);
            } finally {
                setLoading(false);
                setMethod(null);
                setConfig(null);
            }
        };

        if (method === "POST") {
            httpRequest();
        }
    }, [config, method, url]);

    return { data, loading, error, httpConfig };
};