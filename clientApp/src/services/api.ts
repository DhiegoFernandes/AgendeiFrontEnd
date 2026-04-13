import axios from "axios";

// ============================================
// CONFIGURAÇÃO DE DEPLOY
// ============================================
// Para usar HTTP direto (sem proxy), defina:
// VITE_USE_HTTP_DIRECT=true
// 
// Isso é útil se você estiver usando um serviço de deploy
// que permite HTTP (Netlify, Railway, Render, servidor próprio)
// ============================================

const useHttpDirect = import.meta.env.VITE_USE_HTTP_DIRECT === 'true';
const isProduction = import.meta.env.PROD;
const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://152.67.42.48:8080/";

// Determina a baseURL baseado na configuração
let baseURL: string;

if (useHttpDirect) {
  // Usa HTTP direto (para serviços que permitem HTTP)
  baseURL = backendUrl;
} else if (isProduction) {
  // Usa proxy do Vercel (para evitar mixed content)
  baseURL = "/api/proxy";
} else {
  // Desenvolvimento local
  baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8083/";
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

export default api;