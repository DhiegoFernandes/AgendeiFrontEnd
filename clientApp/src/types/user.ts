export interface User {
    nome: string,
    email: string,
    telefone: string,
    senha: string,
    perfil: string,
    cep?: string,
    endereco?: string,
    numero?: string,
}

export enum EnumUser {
  cliente = "CLIENTE",
  admin = "ADMIN",
  prestador = "PRESTADOR"
}

export type Negocio = {
  id: number;
  nome: string;
  endereco: string;
  cep: string;
  categoria: string;
  ativo: boolean;
};

export type UserWithNegocio = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: string;
  ativo: boolean;
  negocio: Negocio;
};

export type Avaliacao = {
  id: number;
  negocioId: number;
  nomeNegocio: string;
  clienteId: number;
  nomeCliente: string;
  nota: number;
  comentario: string;
  dataAvaliacao: string;
};

export type Agendamento = {
  id: number;
  clienteNome: string;
  prestadorNome: string;
  servicoTitulo: string;
  enderecoNegocio: string;
  dataHora: string;
  status: "CONCLUIDO" | "PENDENTE" | "CANCELADO";
};

export type MetricasAgendamento = {
  agendamentosHoje: number;
  agendamentosPendentes: number;
  agendamentosPendentesSemana: number;
  agendamentosConcluidosMes: number;
  agendamentosConcluidosHoje: number;
};

export type RelatorioFinanceiro = {
  ganhosEsperados: number;
  ganhosRealizados: number;
  taxaCancelamentos: number;
};

export type ServicoMaisVendido = {
  tituloServico: string;
  quantidadeAgendamentos: number;
  totalFaturado: number;
};

export type EvolucaoMensal = {
  mes: string; // formato "YYYY-MM"
  faturamento: number;
};

export type EvolucaoAnual = {
  ano: number;
  faturamento: number;
};

export type FotoNegocio = {
  id: number;
  nomeArquivo: string;
  url: string;
};

export type PrestadorRelatorio = {
  id: number;
  nome: string;
  ganhos: number;
  taxaCancelamento: number;
};

export type RelatorioNegocio = {
  nomeNegocio: string;
  mes: string; // formato "YYYY-MM"
  ganhosTotais: number;
  totalServicos: number;
  prestadores: PrestadorRelatorio[];
};