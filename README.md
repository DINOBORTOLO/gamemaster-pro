# 🎮 GameMaster Pro - Plataforma de Guias e Estratégias de Gaming

Plataforma futurista para compartilhar guias, estratégias e comunidade de gaming com suporte a múltiplos jogos.

## 🚀 Features

- ✅ **Páginas Únicas por Jogo** - Cada jogo tem sua própria página com dados específicos
- ✅ **Chat em Tempo Real** - Comunidade interativa
- ✅ **Sistema de Favoritos** - Salve guias favoritas
- ✅ **Dashboard do Proprietário** - Gerenciamento completo
- ✅ **Cadastros Funcionais** - Anúncios, Parceiros, Patrocinadores, Receita
- ✅ **Autenticação** - Login seguro com Supabase
- ✅ **Banco de Dados** - PostgreSQL com Supabase
- ✅ **Design Futurista** - UI/UX moderna com gradientes e animações

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth
- **Hospedagem:** Vercel
- **Gráficos:** Chart.js

## 📋 Pré-requisitos

- Node.js 14+ (para desenvolvimento local)
- Conta GitHub
- Conta Supabase (grátis)
- Conta Vercel (grátis)

## 🔧 Setup Local

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/gamemaster-pro.git
cd gamemaster-pro
```

### 2. Instale dependências
```bash
npm install
```

### 3. Configure variáveis de ambiente
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais Supabase
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

Acesse `http://localhost:3000`

## 🌐 Deploy na Vercel

### 1. Push para GitHub
```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 2. Conecte no Vercel
- Acesse [vercel.com](https://vercel.com)
- Clique em "New Project"
- Selecione seu repositório GitHub
- Configure variáveis de ambiente
- Clique em "Deploy"

## 🗄️ Configuração Supabase

### 1. Criar tabelas necessárias

```sql
-- Tabela de Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  searches INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Guias
CREATE TABLE guides (
  id SERIAL PRIMARY KEY,
  game VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  rating DECIMAL(3,1) DEFAULT 5.0,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Anúncios
CREATE TABLE advertisements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Parceiros
CREATE TABLE partners (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  commission DECIMAL(5,2) NOT NULL,
  sales DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Patrocinadores
CREATE TABLE sponsors (
  id SERIAL PRIMARY KEY,
  brand VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  monthly_value DECIMAL(10,2) NOT NULL,
  duration_months INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Receita
CREATE TABLE revenue (
  id SERIAL PRIMARY KEY,
  source VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Chat
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  game VARCHAR(100),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Favoritos
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  guide_id INTEGER REFERENCES guides(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Credenciais de Teste

**Usuário (Jogador):**
```
Email: user@example.com
Senha: user123
```

**Proprietário (Admin):**
```
Email: admin@example.com
Senha: admin123
```

## 📊 Estrutura de Dados

### Games Suportados
- Fortnite (25M jogadores, 127 guias)
- League of Legends (12M jogadores, 234 guias)
- Minecraft (70M jogadores, 189 guias)
- Valorant (8M jogadores, 156 guias)
- Elden Ring (2M jogadores, 98 guias)
- PUBG (20M jogadores, 142 guias)

## 🎯 Roadmap

- [ ] Sistema de ranking em tempo real
- [ ] Notificações push
- [ ] Integração com Twitch
- [ ] Sistema de monetização
- [ ] App mobile (React Native)
- [ ] Integração com Discord
- [ ] Analytics avançado
- [ ] Sistema de badges e achievements

## 📝 Licença

MIT License - veja LICENSE.md para detalhes

## 👥 Contribuições

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do email.

---

**Desenvolvido com ❤️ para a comunidade de gaming**
