import api from "./api";
import type { Agendamento, MetricasAgendamento } from "../types/user";

/**
 * Busca todos os agendamentos do prestador
 */
export async function buscarAgendamentosPrestador(): Promise<Agendamento[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token não encontrado");
    }

    const response = await api.get("/agendamentos/prestador", {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    throw error;
  }
}

/**
 * Calcula as métricas dos agendamentos baseado nos dados recebidos
 */
export function calcularMetricasAgendamentos(agendamentos: Agendamento[]): MetricasAgendamento {
  const hoje = new Date();
  const inicioDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const fimDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59);
  // Semana atual (segunda a domingo)
  const diaDaSemana = (hoje.getDay() + 6) % 7; // 0 = segunda
  const inicioDaSemana = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - diaDaSemana, 0, 0, 0);
  const fimDaSemana = new Date(inicioDaSemana);
  fimDaSemana.setDate(inicioDaSemana.getDate() + 6);
  fimDaSemana.setHours(23, 59, 59, 999);

  // Normalizar data para comparação (apenas dia/mês/ano)
  const hojeNormalizado = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

  let agendamentosHoje = 0;
  let agendamentosPendentes = 0;
  let agendamentosConcluidosMes = 0;
  let agendamentosPendentesSemana = 0;

  agendamentos.forEach((agendamento) => {
    const dataAgendamento = new Date(agendamento.dataHora);
    const dataAgendamentoNormalizada = new Date(
      dataAgendamento.getFullYear(),
      dataAgendamento.getMonth(),
      dataAgendamento.getDate()
    );

    // Agendamentos para hoje
    if (dataAgendamentoNormalizada.getTime() === hojeNormalizado.getTime()) {
      agendamentosHoje++;
    }

    // Agendamentos pendentes para hoje
    if (
      dataAgendamentoNormalizada.getTime() === hojeNormalizado.getTime() &&
      agendamento.status === "PENDENTE"
    ) {
      agendamentosPendentes++;
    }

    // Agendamentos pendentes na semana atual
    if (
      dataAgendamento >= inicioDaSemana &&
      dataAgendamento <= fimDaSemana &&
      agendamento.status === "PENDENTE"
    ) {
      agendamentosPendentesSemana++;
    }

    // Agendamentos concluídos no mês atual
    if (
      dataAgendamento >= inicioDoMes &&
      dataAgendamento <= fimDoMes &&
      agendamento.status === "CONCLUIDO"
    ) {
      agendamentosConcluidosMes++;
    }
  });

  return {
    agendamentosHoje,
    agendamentosPendentes,
    agendamentosPendentesSemana,
    agendamentosConcluidosMes,
  };
}

/**
 * Calcula a quantidade de agendamentos pendentes da semana
 */
export function calcularPendentesSemana(agendamentos: Agendamento[]): number {
  const hoje = new Date();
  const diaDaSemana = (hoje.getDay() + 6) % 7; // segunda=0
  const inicioDaSemana = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - diaDaSemana, 0, 0, 0);
  const fimDaSemana = new Date(inicioDaSemana);
  fimDaSemana.setDate(inicioDaSemana.getDate() + 6);
  fimDaSemana.setHours(23, 59, 59, 999);

  return agendamentos.reduce((acc, ag) => {
    const d = new Date(ag.dataHora);
    if (d >= inicioDaSemana && d <= fimDaSemana && ag.status === "PENDENTE") {
      return acc + 1;
    }
    return acc;
  }, 0);
}

/**
 * Busca e retorna apenas o número de pendentes da semana
 */
export async function obterPendentesSemana(): Promise<number> {
  const ags = await buscarAgendamentosPrestador();
  return calcularPendentesSemana(ags);
}

/**
 * Função principal que busca os agendamentos e calcula as métricas
 */
export async function obterMetricasAgendamentos(): Promise<MetricasAgendamento> {
  try {
    const agendamentos = await buscarAgendamentosPrestador();
    return calcularMetricasAgendamentos(agendamentos);
  } catch (error) {
    console.error("Erro ao obter métricas dos agendamentos:", error);
    throw error;
  }
}

/**
 * Função utilitária para formatar data para exibição
 */
export function formatarDataParaExibicao(dataHora: string): string {
  const data = new Date(dataHora);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Função utilitária para verificar se um agendamento é de hoje
 */
export function ehAgendamentoDeHoje(dataHora: string): boolean {
  const hoje = new Date();
  const dataAgendamento = new Date(dataHora);
  
  const hojeNormalizado = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const dataAgendamentoNormalizada = new Date(
    dataAgendamento.getFullYear(),
    dataAgendamento.getMonth(),
    dataAgendamento.getDate()
  );

  return dataAgendamentoNormalizada.getTime() === hojeNormalizado.getTime();
}

/**
 * Função utilitária para verificar se um agendamento é do mês atual
 */
export function ehAgendamentoDoMesAtual(dataHora: string): boolean {
  const hoje = new Date();
  const dataAgendamento = new Date(dataHora);
  
  return (
    dataAgendamento.getMonth() === hoje.getMonth() &&
    dataAgendamento.getFullYear() === hoje.getFullYear()
  );
}
