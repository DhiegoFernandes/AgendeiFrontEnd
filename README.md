# Agendei - Frontend

Versão: v1.0.0 Último Commit: b5282fbd342f706b430cce9b106244bd74aec31e Data: 30/11/2025

Aplicação web desenvolvida em React com TypeScript para gerenciamento de agendamentos de serviços. O frontend permite que clientes agendem serviços e que parceiros gerenciem seus negócios, serviços e agendamentos.

## 🚀 Tecnologias

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

- **React 19.1.1** - Biblioteca JavaScript para construção de interfaces de usuário
- **Vite 7.1.2** - Build tool e servidor de desenvolvimento
- **TypeScript 5.8.3** - Superset do JavaScript com tipagem estática
- **React Router DOM 7.9.1** - Roteamento para aplicações React
- **Axios 1.12.2** - Cliente HTTP para fazer requisições à API
- **Tailwind CSS 4.1.14** - Framework CSS utility-first
- **Material-UI (MUI) 7.3.4** - Biblioteca de componentes React
- **date-fns 4.1.0** - Biblioteca para manipulação de datas
- **React Toastify 11.0.5** - Biblioteca para notificações toast

## 📦 Versões

### Frameworks e Bibliotecas Principais

| Tecnologia | Versão |
|------------|--------|
| React | ^19.1.1 |
| React DOM | ^19.1.1 |
| Vite | ^7.1.2 |
| TypeScript | ~5.8.3 |
| React Router DOM | ^7.9.1 |
| Axios | ^1.12.2 |
| Tailwind CSS | ^4.1.14 |
| @mui/material | ^7.3.4 |
| @mui/x-charts | ^8.16.0 |
| @mui/x-date-pickers | ^8.16.0 |
| date-fns | ^4.1.0 |
| react-icons | ^5.5.0 |
| react-toastify | ^11.0.5 |

### Dependências de Desenvolvimento

| Tecnologia | Versão |
|------------|--------|
| @vitejs/plugin-react | ^5.0.0 |
| ESLint | ^9.33.0 |
| TypeScript ESLint | ^8.39.1 |
| Autoprefixer | ^10.4.21 |
| PostCSS | ^8.5.6 |

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior)
- **npm** (geralmente vem com o Node.js) ou **yarn**
- **Git** (para clonar o repositório)

Para verificar se você tem o Node.js instalado, execute:

```bash
node --version
npm --version
```

## 📥 Instalação

1. **Clone o repositório** (se ainda não tiver feito):

```bash
git clone https://github.com/dhiegosenac/agendeiFrontSenac.git
cd TccFrontEnd/clientApp
```

2. **Instale as dependências**:

```bash
npm install
```

ou, se estiver usando yarn:

```bash
yarn install
```

## 🎯 Script para iniciar o servidor de desenvolvimento

No diretório do projeto, você pode executar o seguinte comando:

### `npm run dev`

Inicia o servidor de desenvolvimento. A aplicação estará disponível em `http://localhost:5173` (porta padrão do Vite).

```bash
npm run dev
```

O servidor recarrega automaticamente quando você faz alterações no código.

## 📝 Notas Importantes

- O projeto utiliza **TypeScript** para maior segurança de tipos
- O **Tailwind CSS** é usado para estilização, com suporte a classes utilitárias
- O **Material-UI** fornece componentes prontos para uso
- As rotas privadas são protegidas pelo componente `PrivateRoute`
- O sistema de autenticação utiliza JWT tokens armazenados no `localStorage`

## 📄 Licença

Projeto desenvolvido como Trabalho de Conclusão de Curso (TCC).

Este projeto é privado e destinado apenas para fins acadêmicos.
