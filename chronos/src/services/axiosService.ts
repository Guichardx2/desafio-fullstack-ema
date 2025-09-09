import axios, { type AxiosInstance, type AxiosError } from "axios";
import axiosRetry from 'axios-retry';

type ApiResponse<T = any> = T;

interface Params {
    [key: string]: any;
}


//Axios configuration with retry
const axiosInstance: AxiosInstance = axios.create({
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosRetry(axiosInstance, {
    retries: 3,
    retryDelay: (retryCount, error) => {
        console.warn(`Tentativa ${retryCount} para ${error.config?.url || 'URL desconhecida'} devido a ${error.message}`);
        return axiosRetry.exponentialDelay(retryCount, error, 1000);
    },
    retryCondition: (error: AxiosError) => {

        return (
            axiosRetry.isNetworkError(error) ||
            axiosRetry.isRetryableError(error) ||
            error.response?.status === 429
        );
    },
    shouldResetTimeout: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        console.error(`Erro Axios: ${error.message}`, error.stack);
        if (error.response) {
            
            console.error(`Status: ${error.response.status} Dados: ${JSON.stringify(error.response.data)}`);
        
            const backendMessage = (error.response.data as any)?.message;
            if (backendMessage) {
                if (Array.isArray(backendMessage)) {
                    error.message = backendMessage.join('; ');
                } else if (typeof backendMessage === 'string') {
                    error.message = backendMessage;
                } else {
                    error.message = String(backendMessage);
                }
            }
        } else if (error.request) {
            console.error(`Nenhuma reposta recebida: ${error.request}`);
        }

        // Preserve the original AxiosError so consumers can inspect response.data
        return Promise.reject(error);
    }
);

// Basic CRUD methods
const get = async <T = any>(
    url: string,
    params: Params = {}
): Promise<ApiResponse<T>> => {
    const res = await axiosInstance.get<T>(url, { params });
    return res.data;
};

const post = async <T = any>(url: string, data: any): Promise<ApiResponse<T>> => {
    const res = await axiosInstance.post<T>(url, data);
    return res.data;
};

const put = async <T = any>(url: string, data: any): Promise<ApiResponse<T>> => {
    const res = await axiosInstance.put<T>(url, data);
    return res.data;
};

const patch = async <T = any>(url: string, data: any): Promise<ApiResponse<T>> => {
    const res = await axiosInstance.patch<T>(url, data);
    return res.data;
};

const del = async <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
    const res = await axiosInstance.delete<T>(url, { data });
    return res.data;
};

export default { get, post, put, patch, del };