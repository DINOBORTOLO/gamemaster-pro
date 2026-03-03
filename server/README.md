# GameMaster Pro - Backend Autônomo

Sistema inteligente que captura dados de jogos em tempo real, filtra por tipo e nível de acesso, e exibe dinamicamente.

## 🚀 Características

- **Scraping Autônomo**: Captura dados da internet sobre jogos
- **Processamento com IA**: Analisa e categoriza conteúdo
- **Filtros Inteligentes**: Por jogo, tipo, relevância e nível
- **Permissões por Nível**: Controle de acesso granular
- **Atualização Automática**: Cron jobs para sincronização
- **API RESTful**: Endpoints para o frontend

## 📋 Tipos de Dados Capturados

- **Estratégias**: Guias de gameplay
- **Notícias**: Atualizações e patches
- **Produtos**: Equipamentos e gear
- **Cupons**: Promoções e descontos
- **Futuro**: Roadmap e planejamento
- **Tier Lists**: Rankings de personagens
- **Builds**: Configurações recomendadas

## 🔐 Níveis de Acesso

| Nível | Acesso |
|-------|--------|
| FREE (1) | Estratégias básicas |
| BRONZE (5) | Estratégias + Produtos |
| SILVER (10) | Tudo anterior + Notícias + Cupons |
| GOLD (15) | Tudo anterior + Futuro do jogo |
| PLATINUM (20) | VIP + Análises exclusivas |

## 📡 Endpoints da API

### Listar Jogos
```bash
GET /api/games
```

**Resposta:**
```json
[
  { "id": "fortnite", "name": "Fortnite", "icon": "🎮" },
  { "id": "lol", "name": "League of Legends", "icon": "⚔️" }
]
```

### Dados de um Jogo
```bash
GET /api/game/:gameId?level=10
```

**Resposta:**
```json
{
  "game": "fortnite",
  "userLevel": 10,
  "data": {
    "strategies": [...],
    "news": [...],
    "products": [...]
  },
  "timestamp": "2024-03-02T..."
}
```

### Dados por Tipo
```bash
GET /api/game/:gameId/type/:type?level=10
```

**Tipos:** `strategies`, `news`, `products`, `coupons`, `future`

**Resposta:**
```json
{
  "game": "fortnite",
  "type": "strategies",
  "userLevel": 10,
  "items": [...],
  "count": 5,
  "timestamp": "2024-03-02T..."
}
```

### Buscar
```bash
GET /api/search?q=building&level=10
```

**Resposta:**
```json
{
  "query": "building",
  "userLevel": 10,
  "results": [...],
  "count": 3
}
```

### Sincronizar
```bash
POST /api/sync
```

**Resposta:**
```json
{
  "status": "success",
  "message": "Data synced with Supabase",
  "timestamp": "2024-03-02T..."
}
```

## 🔄 Cron Jobs

### Captura de Dados (A cada 6 horas)
```
0 */6 * * *
```
- Scraping de dados de todos os jogos
- Processamento com IA
- Atualização de cache

### Sincronização (A cada 12 horas)
```
0 */12 * * *
```
- Sincroniza com Supabase
- Limpa dados obsoletos
- Gera relatórios

## 🏃 Instalação e Execução

### 1. Instalar Dependências
```bash
cd server
npm install
```

### 2. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
# Edite .env com suas credenciais
```

### 3. Iniciar Servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

### 4. Verificar Health
```bash
curl http://localhost:3001/health
```

## 🔗 Integração com Frontend

### JavaScript/Fetch
```javascript
// Buscar dados de um jogo
const response = await fetch('http://localhost:3001/api/game/fortnite?level=10');
const data = await response.json();
console.log(data);

// Buscar por tipo
const strategies = await fetch('http://localhost:3001/api/game/fortnite/type/strategies?level=10');
const items = await strategies.json();
```

### React Hook
```javascript
import { useEffect, useState } from 'react';

function GameData({ gameId, userLevel }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/api/game/${gameId}?level=${userLevel}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [gameId, userLevel]);

  if (loading) return <div>Carregando...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

## 🤖 Processamento com IA

### Integração OpenAI (Exemplo)
```javascript
const OpenAI = require('openai');

async function analyzeGameData(data) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'user',
        content: `Analise estes dados de jogo e categorize: ${JSON.stringify(data)}`
      }
    ],
  });

  return response.choices[0].message.content;
}
```

## 📊 Banco de Dados (Supabase)

### Tabelas Necessárias

```sql
-- Dados capturados
CREATE TABLE game_data (
  id SERIAL PRIMARY KEY,
  game VARCHAR(100),
  type VARCHAR(50),
  title VARCHAR(255),
  content TEXT,
  level INTEGER,
  source_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cache de resultados
CREATE TABLE cache (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE,
  value JSONB,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Logs de sincronização
CREATE TABLE sync_logs (
  id SERIAL PRIMARY KEY,
  game VARCHAR(100),
  status VARCHAR(50),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testes

```bash
npm test
```

## 📈 Monitoramento

### Logs
```bash
# Ver logs em tempo real
tail -f logs/app.log

# Filtrar por tipo
grep "CRON" logs/app.log
grep "ERROR" logs/app.log
```

### Métricas
- Requisições por segundo
- Tempo de resposta
- Taxa de erro
- Uso de memória

## 🚀 Deploy

### Vercel
```bash
vercel deploy
```

### Heroku
```bash
heroku create gamemaster-pro-backend
git push heroku main
```

### Railway
```bash
railway link
railway up
```

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "Port already in use"
```bash
lsof -i :3001
kill -9 <PID>
```

### Erro: "Supabase connection failed"
- Verifique variáveis de ambiente
- Teste conexão: `curl https://gfxnggfmhtnotzuaiadv.supabase.co`

## 📚 Documentação Adicional

- [Express.js](https://expressjs.com/)
- [Node-cron](https://github.com/kelektiv/node-cron)
- [Supabase](https://supabase.com/docs)
- [Cheerio (Scraping)](https://cheerio.js.org/)
- [Puppeteer (Scraping Avançado)](https://pptr.dev/)

## 📝 Licença

MIT

## 👥 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub!
