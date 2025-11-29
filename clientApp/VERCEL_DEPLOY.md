# Configuração de Deploy no Vercel

## Variáveis de Ambiente

Para fazer o deploy no Vercel, você precisa configurar a variável de ambiente `VITE_API_BASE_URL`.

### Como configurar no Vercel:

1. Acesse o painel do Vercel: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **Environment Variables**
4. Adicione a seguinte variável:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `http://152.67.42.48:8080/`
   - **Environment**: Selecione **Production**, **Preview** e **Development** (ou apenas Production se preferir)

### Para desenvolvimento local:

Crie um arquivo `.env.local` na raiz do projeto `clientApp/` com:

```
VITE_API_BASE_URL=http://localhost:8083/
```

**Nota**: O arquivo `.env.local` já está no `.gitignore` e não será commitado.

### Verificação:

Após configurar, faça o rebuild do projeto no Vercel. A aplicação usará automaticamente a URL de produção configurada.

