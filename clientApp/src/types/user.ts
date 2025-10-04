export interface User {
    nome: string,
    email: string,
    telefone: string,
    senha: string,
    perfil: string,
    cep?: string,
    endereco?: string,
}

export interface ResponseLogin {
    token: string,
    perfil: EnumUser
}

export enum EnumUser {
  cliente = "CLIENTE",
  admin = "ADMIN",
  prestador = "PRESTADOR"
}