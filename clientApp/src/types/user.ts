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