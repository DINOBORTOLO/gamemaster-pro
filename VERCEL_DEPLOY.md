# 🚀 Guia de Deploy na Vercel para GameMaster Pro

## Passo 1: Preparar Repositório GitHub

### 1.1 Criar conta GitHub (se não tiver)
- Acesse [github.com](https://github.com)
- Clique em "Sign up"
- Complete o registro

### 1.2 Criar novo repositório

1. Clique em "+" no canto superior direito
2. Selecione "New repository"
3. Nome: `gamemaster-pro`
4. Descrição: "Plataforma de Guias e Estratégias de Gaming"
5. Selecione "Public"
6. Clique em "Create repository"

### 1.3 Fazer push do código

No seu terminal (na pasta do projeto):

```bash
# Configurar Git
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"

# Adicionar arquivos
git add .

# Fazer commit
git commit -m "Initial commit: GameMaster Pro setup"

# Adicionar remote (substitua USERNAME e REPO)
git remote add origin https://github.com/USERNAME/gamemaster-pro.git

# Fazer push
git branch -M main
git push -u origin main
```

## Passo 2: Criar Conta Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up"
3. Escolha "Continue with GitHub"
4. Autorize o Vercel a acessar suas contas
5. Complete o setup

## Passo 3: Importar Projeto

### 3.1 No Vercel Dashboard

1. Clique em "Add New..." → "Project"
2. Selecione "Import Git Repository"
3. Procure por `gamemaster-pro`
4. Clique em "Import"

### 3.2 Configurar Projeto

1. **Framework Preset:** Selecione "Other" (é um site estático)
2. **Root Directory:** Deixe em branco
3. **Build Command:** `npm run build`
4. **Output Directory:** `.` (ponto)
5. **Install Command:** `npm install`

## Passo 4: Adicionar Variáveis de Ambiente

1. Na página de import, clique em "Environment Variables"
2. Adicione as seguintes variáveis:

| Nome | Valor |
|------|-------|
| `VITE_SUPABASE_URL` | `https://seu-projeto.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sua-chave-anonima-aqui` |

3. Clique em "Deploy"

**⏳ Aguarde 1-2 minutos enquanto o Vercel faz o build e deploy**

## Passo 5: Seu Site Está Online! 🎉

Após o deploy, você receberá um URL como:
```
https://gamemaster-pro.vercel.app
```

### Acessar seu site:
- Clique no link fornecido
- Ou vá para `https://gamemaster-pro.vercel.app`

## Passo 6: Configurar Domínio Customizado (Opcional)

### 6.1 Adicionar domínio

1. Vá para "Settings" → "Domains"
2. Clique em "Add Domain"
3. Digite seu domínio (ex: `gamemaster.com`)
4. Clique em "Add"

### 6.2 Configurar DNS

Siga as instruções fornecidas pelo Vercel para apontar seu domínio.

## Passo 7: Configurar Deployments Automáticos

Agora, toda vez que você fizer push para o GitHub, o Vercel fará deploy automaticamente!

### Workflow:

```bash
# Fazer mudanças no código
# ...

# Fazer commit e push
git add .
git commit -m "Descrição das mudanças"
git push origin main

# Vercel detecta automaticamente e faz deploy! 🚀
```

## 🔄 Atualizações Futuras

### Para atualizar o site:

1. Faça as mudanças no código local
2. Teste localmente: `npm run dev`
3. Faça commit: `git commit -m "Descrição"`
4. Faça push: `git push origin main`
5. Vercel faz deploy automaticamente

### Monitorar deploy:

1. Vá para seu projeto no Vercel
2. Clique em "Deployments"
3. Veja o status em tempo real

## 📊 Analytics e Monitorar

### No Vercel Dashboard:

- **Deployments:** Histórico de deploys
- **Analytics:** Visitas, performance
- **Logs:** Erros e informações
- **Settings:** Configurações gerais

## 🔐 Segurança

### Boas Práticas:

1. **Nunca** faça commit de `.env` (use `.env.example`)
2. Use variáveis de ambiente no Vercel
3. Ative "Preview Deployments" para testar antes
4. Configure webhooks para notificações

### Proteger Repositório:

1. Vá para GitHub → Settings → Branches
2. Clique em "Add rule"
3. Selecione "main"
4. Ative "Require pull request reviews"
5. Ative "Dismiss stale pull request approvals"

## 🚨 Troubleshooting

### Erro: "Build failed"

1. Verifique se `package.json` está correto
2. Verifique se `vercel.json` está configurado
3. Veja os logs no Vercel

### Erro: "Cannot find module"

1. Certifique-se de que todas as dependências estão em `package.json`
2. Execute `npm install` localmente
3. Faça push novamente

### Site não carrega

1. Verifique se variáveis de ambiente estão corretas
2. Abra o console (F12) e veja os erros
3. Verifique a conexão com Supabase

## 📈 Próximos Passos

1. ✅ Testar plataforma online
2. ✅ Coletar feedback dos usuários
3. ✅ Implementar melhorias
4. ✅ Adicionar mais features
5. ✅ Escalar para produção

## 💡 Dicas

- Use "Preview Deployments" para testar mudanças antes de publicar
- Configure notificações no Slack para deploys
- Use branches para desenvolvimento (não faça push direto para main)
- Mantenha um changelog de atualizações

## 📞 Suporte

- Documentação Vercel: [vercel.com/docs](https://vercel.com/docs)
- Community: [vercel.com/community](https://vercel.com/community)
- Status: [status.vercel.com](https://status.vercel.com)

---

**Seu site está no ar! Compartilhe com o mundo! 🌍**
