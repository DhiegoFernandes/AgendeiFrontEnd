# Alternativas para Resolver Mixed Content

## ⚠️ Limitação do Vercel

O **Vercel sempre serve sites via HTTPS** - não é possível desabilitar isso. Portanto, não podemos "colocar o front como HTTP" no Vercel.

## ✅ Soluções Possíveis

### Opção 1: Configurar HTTPS no Backend (RECOMENDADO) ⭐

Esta é a melhor solução a longo prazo:

1. **Obter certificado SSL** para o backend (Let's Encrypt é gratuito)
2. **Configurar o backend** para aceitar conexões HTTPS na porta 443
3. **Atualizar a URL** do backend para `https://152.67.42.48:443` ou usar um domínio com SSL

**Vantagens:**
- ✅ Segurança completa (HTTPS end-to-end)
- ✅ Sem problemas de mixed content
- ✅ Melhor para produção
- ✅ Não precisa de proxy

**Desvantagens:**
- ⚠️ Requer configuração no servidor do backend
- ⚠️ Pode precisar de domínio próprio

---

### Opção 2: Usar Outro Serviço de Deploy que Permita HTTP

Alguns serviços permitem servir sites via HTTP:

#### **Netlify**
- Permite desabilitar HTTPS (não recomendado para produção)
- Configuração similar ao Vercel

#### **Railway**
- Permite configurar HTTP/HTTPS
- Boa alternativa ao Vercel

#### **Render**
- Permite servir via HTTP
- Gratuito para projetos pessoais

#### **Servidor Próprio (VPS)**
- Controle total sobre HTTP/HTTPS
- Exemplos: DigitalOcean, AWS EC2, Linode

**Como migrar:**
1. Fazer build do projeto: `npm run build`
2. Fazer deploy do conteúdo de `dist/` no serviço escolhido
3. Configurar para servir via HTTP
4. Atualizar `api.ts` para usar a URL HTTP do backend diretamente

---

### Opção 3: Corrigir o Proxy no Vercel (TENTAR NOVAMENTE)

A solução de proxy pode funcionar se configurada corretamente. As alterações feitas devem funcionar, mas pode ser necessário:

1. Verificar os logs do Vercel para ver erros específicos
2. Testar a função serverless diretamente
3. Ajustar a configuração conforme necessário

---

## 🔧 Configuração Atual

O projeto está configurado para:
- **Produção (Vercel)**: Usa `/api/proxy` (função serverless) - padrão
- **Produção (HTTP direto)**: Usa URL HTTP do backend diretamente - configure `VITE_USE_HTTP_DIRECT=true`
- **Desenvolvimento**: Usa `http://localhost:8083/` diretamente

### Para usar HTTP direto (sem proxy):

1. **No serviço de deploy** (Netlify, Railway, etc.), configure a variável de ambiente:
   ```
   VITE_USE_HTTP_DIRECT=true
   VITE_API_BASE_URL=http://152.67.42.48:8080/
   ```

2. **Faça o rebuild** do projeto

3. O frontend usará HTTP diretamente, sem proxy

### Para continuar usando o proxy no Vercel:

- Não configure `VITE_USE_HTTP_DIRECT` (ou deixe como `false`)
- O sistema usará o proxy automaticamente

---

## 📝 Recomendação

**Para produção, recomendo fortemente a Opção 1 (HTTPS no backend)** porque:
- É a solução mais segura
- Resolve o problema definitivamente
- É o padrão da indústria
- Não requer workarounds

Se não for possível configurar HTTPS no backend agora, a Opção 2 (outro serviço de deploy) é uma alternativa viável.

