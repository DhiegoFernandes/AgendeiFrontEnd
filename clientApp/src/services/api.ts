import axios from "axios";

// Detecta se está em produção (Vercel)
const isProduction = import.meta.env.PROD;

// Em produção: usa o proxy do Vercel para evitar mixed content (HTTPS -> HTTP)
// Em desenvolvimento: usa a URL direta do backend
const baseURL = isProduction 
    ? "/api/proxy"  // Proxy serverless do Vercel
    : (import.meta.env.VITE_API_BASE_URL || "http://localhost:8083/");

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
})

export default api;