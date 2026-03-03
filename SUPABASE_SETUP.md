# 🗄️ Guia de Setup Supabase para GameMaster Pro

## Passo 1: Criar Conta Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Sign Up"
3. Use email ou GitHub
4. Confirme seu email
5. Crie uma nova organização (ou use a padrão)

## Passo 2: Criar Novo Projeto

1. Clique em "New Project"
2. Escolha um nome: `gamemaster-pro`
3. Escolha uma senha forte (salve em local seguro!)
4. Selecione a região mais próxima
5. Clique em "Create new project"

**⏳ Aguarde 2-3 minutos enquanto o projeto é criado**

## Passo 3: Obter Credenciais

1. Vá para "Settings" → "API"
2. Copie:
   - **Project URL** (ex: `https://seu-projeto.supabase.co`)
   - **anon public** (a chave de API pública)
3. Guarde essas credenciais!

## Passo 4: Criar Tabelas do Banco de Dados

1. Vá para "SQL Editor"
2. Clique em "New Query"
3. Copie e cole o SQL abaixo:

```sql
-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  searches INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Guias
CREATE TABLE IF NOT EXISTS guides (
  id SERIAL PRIMARY KEY,
  game VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  rating DECIMAL(3,1) DEFAULT 5.0,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Anúncios
CREATE TABLE IF NOT EXISTS advertisements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Parceiros
CREATE TABLE IF NOT EXISTS partners (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  commission DECIMAL(5,2) NOT NULL,
  sales DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Patrocinadores
CREATE TABLE IF NOT EXISTS sponsors (
  id SERIAL PRIMARY KEY,
  brand VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  monthly_value DECIMAL(10,2) NOT NULL,
  duration_months INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Receita
CREATE TABLE IF NOT EXISTS revenue (
  id SERIAL PRIMARY KEY,
  source VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Chat
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game VARCHAR(100),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Favoritos
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  guide_id INTEGER REFERENCES guides(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, guide_id)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_guides_game ON guides(game);
CREATE INDEX IF NOT EXISTS idx_guides_author ON guides(author_id);
CREATE INDEX IF NOT EXISTS idx_chat_game ON chat_messages(game);
CREATE INDEX IF NOT EXISTS idx_chat_user ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS (permissões públicas para leitura)
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Guides are viewable by everyone" ON guides
  FOR SELECT USING (true);

CREATE POLICY "Chat messages are viewable by everyone" ON chat_messages
  FOR SELECT USING (true);

CREATE POLICY "Favorites are viewable by owner" ON favorites
  FOR SELECT USING (auth.uid() = user_id);
```

4. Clique em "Run"
5. Aguarde a execução (deve aparecer "Success")

## Passo 5: Inserir Dados Iniciais (Opcional)

No SQL Editor, execute:

```sql
-- Inserir usuários de teste
INSERT INTO users (email, username, points, level, searches, favorites, status)
VALUES 
  ('user@example.com', 'user', 2450, 15, 45, 12, 'active'),
  ('admin@example.com', 'admin', 5000, 20, 100, 50, 'active');

-- Inserir guias de exemplo
INSERT INTO guides (game, title, description, content, views, likes, rating)
VALUES 
  ('Fortnite', 'Como Ganhar Battle Royale em 10 Minutos', 'Aprenda as estratégias dos top 100 jogadores', 'Conteúdo completo...', 15200, 2300, 4.8),
  ('League of Legends', 'Guia Completo de Macro Play', 'Domine o macro game e rotações', 'Conteúdo completo...', 28400, 4100, 4.9),
  ('Minecraft', 'Farm de Diamantes Automática', 'Construa a farm mais eficiente', 'Conteúdo completo...', 56300, 8900, 4.7);

-- Inserir anúncios de exemplo
INSERT INTO advertisements (title, price, description, priority)
VALUES 
  ('Gear Gaming Pro', 99.99, 'Equipamento profissional para gaming', 'high'),
  ('Curso de Estratégia', 49.99, 'Aprenda com profissionais', 'medium');
```

## Passo 6: Configurar Variáveis de Ambiente

### No seu `.env.local`:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### Na Vercel:

1. Vá para seu projeto no Vercel
2. Settings → Environment Variables
3. Adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Passo 7: Testar Conexão

1. Abra o console do navegador (F12)
2. Execute:
```javascript
await initSupabase();
const guides = await getGuides();
console.log(guides);
```

Se aparecer um array com as guias, está funcionando! ✅

## 🔐 Segurança

### Boas Práticas:

1. **Nunca** compartilhe a chave de API privada
2. Use apenas a chave `anon public` no frontend
3. Configure RLS (Row Level Security) para dados sensíveis
4. Use variáveis de ambiente para credenciais
5. Ative autenticação de dois fatores no Supabase

### Limites Grátis do Supabase:

- ✅ 500MB de armazenamento
- ✅ 2GB de transferência/mês
- ✅ Até 50,000 requisições/dia
- ✅ Sem limite de usuários
- ✅ Sem limite de tabelas

## 📞 Suporte

- Documentação: [supabase.com/docs](https://supabase.com/docs)
- Discord: [discord.supabase.com](https://discord.supabase.com)
- Issues: [github.com/supabase/supabase](https://github.com/supabase/supabase)

---

**Pronto! Seu banco de dados está configurado e pronto para usar! 🚀**
