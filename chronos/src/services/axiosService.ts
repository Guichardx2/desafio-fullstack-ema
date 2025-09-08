import axios, { type AxiosInstance, type AxiosError } from "axios";
import axiosRetry from 'axios-retry';

type ApiResponse<T = any> = T;

interface Params {
    [key: string]: any;
}


//Configuyração Axios com retry
const axiosInstance: AxiosInstance = axios.create({
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosRetry(axiosInstance, {
    retries: 3,
    retryDelay: (retryCount, error) => {
        console.warn(`Retry attempt ${retryCount} for ${error.config?.url || 'unknown URL'} due to ${error.message}`);
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
        console.error(`Axios Error: ${error.message}`, error.stack);
        if (error.response) {
            console.error(`Status: ${error.response.status} Data: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            console.error(`No response received: ${error.request}`);
        }

        return Promise.reject(new Error(error.message));
    }
);


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