import api from "./api";
import type { RelatorioFinanceiro, ServicoMaisVendido, EvolucaoMensal, EvolucaoAnual } from "../types/user";
import { format } from "date-fns";

/**
 * Busca o relatório financeiro mensal
 * @param mes - Data no formato Date (será formatada para YYYY-MM)
 */
export async function buscarRelatorioFinanceiroMensal(mes: Date): Promise<RelatorioFinanceiro> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token não encontrado");
    }

    // Formatar data para YYYY-MM (ex: 2025-10)
    const mesFormatado = format(mes, "yyyy-MM");

    const response = await api.get(`/relatorios/financeiro-mensal?mes=${mesFormatado}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar relatório financeiro:", error);
    throw error;
  }
}

/**
 * Busca os serviços mais vendidos
 * @param mes - Data no formato Date (será formatada para YYYY-MM)
 */
export async function buscarServicosMaisVendidos(mes: Date): Promise<ServicoMaisVendido[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token não encontrado");
    }

    // Formatar data para YYYY-MM (ex: 2025-10)
    const mesFormatado = format(mes, "yyyy-MM");

    const response = await api.get(`/relatorios/servicos-mais-vendidos?mes=${mesFormatado}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar serviços mais vendidos:", error);
    throw error;
  }
}

/**
 * Busca a evolução mensal do faturamento
 * @param ano - Ano a ser buscado (ex: 2025)
 */
export async function buscarEvolucaoMensal(ano: number): Promise<EvolucaoMensal[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token não encontrado");
    }

    const response = await api.get(`/relatorios/evolucao-mensal?ano=${ano}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar evolução mensal:", error);
    throw error;
  }
}

/**
 * Busca a evolução anual do faturamento dos últimos 5 anos
 * @param anoInicio - Ano inicial (ano atual - 4)
 * @param anoFim - Ano final (ano atual)
 */
export async function buscarEvolucaoAnual(anoInicio: number, anoFim: number): Promise<EvolucaoAnual[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token não encontrado");
    }

    const response = await api.get(`/relatorios/evolucao-anual?anoInicio=${anoInicio}&anoFim=${anoFim}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar evolução anual:", error);
    throw error;
  }
}

