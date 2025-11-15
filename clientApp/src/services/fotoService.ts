import api from "./api";
import type { FotoNegocio } from "../types/user";

/**
 * Busca a lista de fotos de um negócio
 * @param negocioId ID do negócio
 * @returns Array de fotos com id, nomeArquivo e url
 */
export async function buscarFotosNegocio(negocioId: number): Promise<FotoNegocio[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    const response = await api.get(`/negocios/${negocioId}/fotos`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data || [];
  } catch (error) {
    console.error("Erro ao buscar fotos do negócio:", error);
    throw error;
  }
}

/**
 * Busca a imagem de uma foto específica
 * @param negocioId ID do negócio
 * @param fotoId ID da foto
 * @returns Blob da imagem
 */
export async function buscarImagemFoto(negocioId: number, fotoId: number): Promise<Blob> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    const response = await api.get(`/negocios/${negocioId}/fotos/${fotoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob'
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar imagem da foto:", error);
    throw error;
  }
}

/**
 * Constrói a URL completa da foto
 * @param foto Objeto FotoNegocio
 * @returns URL completa da foto
 */
export function construirUrlFoto(foto: FotoNegocio): string {
  // Se a URL já começa com http, retorna como está
  if (foto.url.startsWith("http")) {
    return foto.url;
  }
  // Caso contrário, adiciona o baseURL da API
  return `${api.defaults.baseURL}${foto.url.replace(/^\//, "")}`;
}

