# Configuração de Deploy no Vercel

## Proxy para Resolver Mixed Content

O projeto utiliza um **proxy serverless** no Vercel para resolver o problema de mixed content (HTTPS → HTTP). O arquivo `api/proxy.js` cria automaticamente um endpoint `/api/proxy` que faz a ponte entre o frontend HTTPS e o backend HTTP.

### Como funciona:

- **Em produção (Vercel)**: O frontend chama `/api/proxy`, que é uma função serverless que faz a requisição para `http://152.67.42.48:8080`
- **Em desenvolvimento local**: O frontend chama diretamente `http://localhost:8083/`

✅ **Não é necessário configurar variáveis de ambiente no Vercel para produção!** O proxy já está configurado com a URL do backend.

### Para desenvolvimento local:

Crie um arquivo `.env.local` na raiz do projeto `clientApp/` com:

```
VITE_API_BASE_URL=http://localhost:8083/
```

**Nota**: O arquivo `.env.local` já está no `.gitignore` e não será commitado.

### Verificação:

Após fazer o deploy, o Vercel automaticamente detecta a pasta `/api` e cria a função serverless. As requisições do frontend serão roteadas através do proxy sem problemas de mixed content.

