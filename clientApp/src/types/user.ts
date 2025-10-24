export interface User {
    nome: string,
    email: string,
    telefone: string,
    senha: string,
    perfil: string,
    cep?: string,
    endereco?: string,
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
};