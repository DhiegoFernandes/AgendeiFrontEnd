import axios from "axios";

// Usa variável de ambiente ou fallback para desenvolvimento local
// Em produção (Vercel): VITE_API_BASE_URL será http://152.67.42.48:8080/
// Em desenvolvimento local: usa http://localhost:8083/ como fallback
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8083/";

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
})

export default api;