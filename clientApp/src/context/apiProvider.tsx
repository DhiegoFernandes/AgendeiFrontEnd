import { ApiContext } from "./apiContext";
import type { ReactNode } from "react";
import api from "../services/api";

export const ApiProvider = ({ children }: { children: ReactNode }) => {
    const get = async <T,>(url: string, params?: object): Promise<T> => {
        const response = await api.get<T>(url, { params });
        return response.data;
    };

    const post = async <T,>(url: string, data?: object): Promise<T> => {
        const response = await api.post<T>(url, data);
        return response.data;
    };

    const put = async <T,>(url: string, data?: object): Promise<T> => {
        const response = await api.put<T>(url, data);
        return response.data;
    };

    const patch = async <T,>(url: string, data?: object): Promise<T> => {
        const response = await api.patch<T>(url, data);
        return response.data;
    };

    const del = async <T,>(url: string): Promise<T> => {
        const response = await api.delete<T>(url);
        return response.data;
    };

    return (
        <ApiContext.Provider value={{ get, post, put, patch, del }}>
        {children}
        </ApiContext.Provider>
    );
};