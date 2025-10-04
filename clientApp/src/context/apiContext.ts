import { createContext } from "react";

export type ApiContextType = {
    get: <T>(url: string, params?: object) => Promise<T>
    post: <T>(url: string, params?: object) => Promise<T>
    patch: <T>(url: string, params?: object) => Promise<T>
    put: <T>(url: string, params?: object) => Promise<T>
    del: <T>(url: string) => Promise<T>
}

export const ApiContext = createContext<ApiContextType>(null!);