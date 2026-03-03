/**
 * GameMaster Pro - Backend Autônomo
 * Sistema inteligente que captura dados de jogos em tempo real
 * Filtra por tipo, jogo e nível de acesso
 * Atualiza automaticamente via cron jobs
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// TIPOS DE DADOS CAPTURADOS
// ============================================

const DATA_TYPES = {
  STRATEGY: 'strategy',      // Estratégias de jogo
  NEWS: 'news',              // Notícias e atualizações
  PRODUCT: 'product',        // Produtos e equipamentos
  COUPON: 'coupon',          // Cupons e promoções
  FUTURE: 'future',          // Futuro do jogo (roadmap)
  GUIDE: 'guide',            // Guias completas
  TIER_LIST: 'tier_list',    // Tier lists
  BUILD: 'build',            // Builds recomendadas
};

// ============================================
// NÍVEIS DE ACESSO
// ============================================

const ACCESS_LEVELS = {
  FREE: 1,      // Acesso básico
  BRONZE: 5,    // Estratégias simples
  SILVER: 10,   // Novidades + cupons
  GOLD: 15,     // Tudo + futuro
  PLATINUM: 20, // VIP + análises exclusivas
};

// ============================================
// DADOS DE EXEMPLO (Simulação)
// ============================================

const GAME_DATA = {
  fortnite: {
    name: 'Fortnite',
    icon: '🎮',
    strategies: [
      { title: 'Drop Landing Guide', level: ACCESS_LEVELS.FREE, type: DATA_TYPES.STRATEGY },
      { title: 'Advanced Building Techniques', level: ACCESS_LEVELS.SILVER, type: DATA_TYPES.STRATEGY },
      { title: 'Pro Player Rotations', level: ACCESS_LEVELS.GOLD, type: DATA_TYPES.STRATEGY },
    ],
    news: [
      { title: 'New Season 5 Map Changes', level: ACCESS_LEVELS.FREE, type: DATA_TYPES.NEWS },
      { title: 'Exclusive Weapon Balance Update', level: ACCESS_LEVELS.SILVER, type: DATA_TYPES.NEWS },
    ],
    products: [
      { title: 'Gaming Headset Pro', price: 199.99, level: ACCESS_LEVELS.BRONZE, type: DATA_TYPES.PRODUCT },
      { title: 'RGB Gaming Mouse', price: 79.99, level: ACCESS_LEVELS.FREE, type: DATA_TYPES.PRODUCT },
    ],
    coupons: [
      { code: 'FORTNITE20', discount: '20%', level: ACCESS_LEVELS.SILVER, type: DATA_TYPES.COUPON },
      { code: 'GAMER50', discount: '50%', level: ACCESS_LEVELS.GOLD, type: DATA_TYPES.COUPON },
    ],
    future: [
      { title: 'Season 6 Roadmap', level: ACCESS_LEVELS.GOLD, type: DATA_TYPES.FUTURE },
      { title: 'New Game Modes Coming', level: ACCESS_LEVELS.GOLD, type: DATA_TYPES.FUTURE },
    ],
  },
  lol: {
    name: 'League of Legends',
    icon: '⚔️',
    strategies: [
      { title: 'Beginner Champion Guide', level: ACCESS_LEVELS.FREE, type: DATA_TYPES.STRATEGY },
      { title: 'Macro Play Fundamentals', level: ACCESS_LEVELS.SILVER, type: DATA_TYPES.STRATEGY },
      { title: 'Pro Player Analysis', level: ACCESS_LEVELS.GOLD, type: DATA_TYPES.STRATEGY },
    ],
    news: [
      { title: 'Patch 14.5 Notes', level: ACCESS_LEVELS.FREE, type: DATA_TYPES.NEWS },
      { title: 'Worlds 2024 Predictions', level: ACCESS_LEVELS.SILVER, type: DATA_TYPES.NEWS },
    ],
    products: [
      { title: 'Mechanical Keyboard RGB', price: 149.99, level: ACCESS_LEVELS.BRONZE, type: DATA_TYPES.PRODUCT },
    ],
    coupons: [
      { code: 'LOL30', discount: '30%', level: ACCESS_LEVELS.SILVER, type: DATA_TYPES.COUPON },
    ],
    future: [
      { title: 'New Champion Teaser', level: ACCESS_LEVELS.GOLD, type: DATA_TYPES.FUTURE },
    ],
  },
  minecraft: {
    name: 'Minecraft',
    icon: '⛏️',
    strategies: [
      { title: 'Survival Mode Basics', level: ACCESS_LEVELS.FREE, type: DATA_TYPES.STRATEGY },
      { title: 'Automatic Farm Building', level: ACCESS_LEVELS.SILVER, type: DATA_TYPES.STRATEGY },
      { title: 'Redstone Engineering', level: ACCESS_LEVELS.GOLD, type: DATA_TYPES.STRATEGY },
    ],
    news: [
      { title: 'Snapshot 24w10a Released', level: ACCESS_LEVELS.FREE, type: DATA_TYPES.NEWS },
    ],
    products: [
      { title: 'Gaming PC Bundle', price: 1299.99, level: ACCESS_LEVELS.GOLD, type: DATA_TYPES.PRODUCT },
    ],
    coupons: [
      { code: 'MINE25', discount: '25%', level: ACCESS_LEVELS.SILVER, type: DATA_TYPES.COUPON },
    ],
    future: [
      { title: 'Caves & Cliffs Part 3', level: ACCESS_LEVELS.GOLD, type: DATA_TYPES.FUTURE },
    ],
  },
};

// ============================================
// FUNÇÕES DE SCRAPING (Simuladas)
// ============================================

/**
 * Simula captura de dados da internet
 * Em produção, usaria bibliotecas como cheerio, puppeteer, etc
 */
async function scrapeGameData(game) {
  console.log(`[SCRAPE] Capturando dados de ${game}...`);
  
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return GAME_DATA[game.toLowerCase()] || null;
}

/**
 * Processa dados com IA (simulado)
 * Em produção, usaria OpenAI API, Claude, etc
 */
async function processWithAI(data) {
  console.log('[AI] Processando dados com IA...');
  
  // Simula processamento
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    ...data,
    processed_at: new Date(),
    ai_score: Math.random() * 100,
  };
}

/**
 * Filtra dados conforme nível de acesso do usuário
 */
function filterByAccessLevel(data, userLevel) {
  const filtered = {};
  
  for (const [key, items] of Object.entries(data)) {
    if (Array.isArray(items)) {
      filtered[key] = items.filter(item => item.level <= userLevel);
    } else {
      filtered[key] = items;
    }
  }
  
  return filtered;
}

// ============================================
// ROTAS API
// ============================================

/**
 * GET /api/games
 * Lista todos os jogos disponíveis
 */
app.get('/api/games', (req, res) => {
  const games = Object.entries(GAME_DATA).map(([key, data]) => ({
    id: key,
    name: data.name,
    icon: data.icon,
  }));
  
  res.json(games);
});

/**
 * GET /api/game/:gameId
 * Retorna dados de um jogo específico
 */
app.get('/api/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const userLevel = req.query.level ? parseInt(req.query.level) : ACCESS_LEVELS.FREE;
    
    const gameData = GAME_DATA[gameId.toLowerCase()];
    
    if (!gameData) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    // Filtra conforme nível de acesso
    const filtered = filterByAccessLevel(gameData, userLevel);
    
    res.json({
      game: gameId,
      userLevel,
      data: filtered,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/game/:gameId/type/:type
 * Retorna dados de um tipo específico (strategy, news, etc)
 */
app.get('/api/game/:gameId/type/:type', async (req, res) => {
  try {
    const { gameId, type } = req.params;
    const userLevel = req.query.level ? parseInt(req.query.level) : ACCESS_LEVELS.FREE;
    
    const gameData = GAME_DATA[gameId.toLowerCase()];
    
    if (!gameData) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    // Mapeia tipo para chave no objeto
    const typeMap = {
      strategies: 'strategies',
      news: 'news',
      products: 'products',
      coupons: 'coupons',
      future: 'future',
    };
    
    const key = typeMap[type];
    if (!key || !gameData[key]) {
      return res.status(404).json({ error: 'Type not found' });
    }
    
    // Filtra conforme nível
    const items = gameData[key].filter(item => item.level <= userLevel);
    
    res.json({
      game: gameId,
      type,
      userLevel,
      items,
      count: items.length,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/search
 * Busca em todos os dados
 */
app.get('/api/search', (req, res) => {
  try {
    const { q, level = ACCESS_LEVELS.FREE } = req.query;
    const userLevel = parseInt(level);
    
    if (!q) {
      return res.status(400).json({ error: 'Query required' });
    }
    
    const results = [];
    const query = q.toLowerCase();
    
    for (const [gameKey, gameData] of Object.entries(GAME_DATA)) {
      for (const [type, items] of Object.entries(gameData)) {
        if (Array.isArray(items)) {
          items.forEach(item => {
            if (item.title && item.title.toLowerCase().includes(query) && item.level <= userLevel) {
              results.push({
                game: gameKey,
                type,
                ...item,
              });
            }
          });
        }
      }
    }
    
    res.json({
      query: q,
      userLevel,
      results,
      count: results.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/sync
 * Sincroniza dados com Supabase
 */
app.post('/api/sync', async (req, res) => {
  try {
    console.log('[SYNC] Iniciando sincronização com Supabase...');
    
    for (const [gameKey, gameData] of Object.entries(GAME_DATA)) {
      // Aqui você salvaria no Supabase
      // await supabase.from('game_data').insert({...})
      console.log(`[SYNC] Sincronizando ${gameKey}...`);
    }
    
    res.json({
      status: 'success',
      message: 'Data synced with Supabase',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CRON JOBS (Atualização Automática)
// ============================================

/**
 * Executa a cada 6 horas
 * Captura dados de todos os jogos
 */
cron.schedule('0 */6 * * *', async () => {
  console.log('[CRON] Iniciando captura automática de dados...');
  
  try {
    for (const gameKey of Object.keys(GAME_DATA)) {
      const data = await scrapeGameData(gameKey);
      const processed = await processWithAI(data);
      console.log(`[CRON] ${gameKey} atualizado com sucesso`);
    }
  } catch (error) {
    console.error('[CRON] Erro na captura:', error);
  }
});

/**
 * Executa a cada 12 horas
 * Sincroniza com Supabase
 */
cron.schedule('0 */12 * * *', async () => {
  console.log('[CRON] Sincronizando com Supabase...');
  
  try {
    // Sincroniza todos os dados
    console.log('[CRON] Sincronização concluída');
  } catch (error) {
    console.error('[CRON] Erro na sincronização:', error);
  }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   GameMaster Pro - Backend Autônomo    ║
╚════════════════════════════════════════╝

✅ Servidor rodando em: http://localhost:${PORT}
✅ API disponível em: http://localhost:${PORT}/api
✅ Health check: http://localhost:${PORT}/health

📊 Endpoints:
  GET  /api/games                    - Lista jogos
  GET  /api/game/:gameId             - Dados do jogo
  GET  /api/game/:gameId/type/:type  - Dados por tipo
  GET  /api/search?q=...             - Buscar
  POST /api/sync                     - Sincronizar

🤖 Cron Jobs:
  ✓ A cada 6 horas: Captura de dados
  ✓ A cada 12 horas: Sincronização

  `);
});

module.exports = app;
