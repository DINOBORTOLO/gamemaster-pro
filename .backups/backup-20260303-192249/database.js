/**
 * GameMaster Pro - Database Integration
 * Sincroniza dados capturados com Supabase
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inicializar cliente Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://gfxnggfmhtnotzuaiadv.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'sb_publishable_Dhc0O5G7h3PcWAim43EWtA_KshCYuie'
);

/**
 * Inserir dados capturados no banco
 */
async function insertScrapedData(data) {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      console.log('⚠️ Nenhum dado para inserir');
      return { success: false, count: 0 };
    }

    console.log(`📊 Inserindo ${data.length} itens no Supabase...`);

    // Inserir em lotes para evitar timeout
    const batchSize = 50;
    let totalInserted = 0;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      const { data: result, error } = await supabase
        .from('scraped_data')
        .insert(batch);

      if (error) {
        console.error(`❌ Erro ao inserir lote ${Math.floor(i / batchSize) + 1}: ${error.message}`);
      } else {
        totalInserted += batch.length;
        console.log(`✅ Lote ${Math.floor(i / batchSize) + 1} inserido (${batch.length} itens)`);
      }
    }

    return { success: true, count: totalInserted };
  } catch (error) {
    console.error(`❌ Erro ao inserir dados: ${error.message}`);
    return { success: false, count: 0, error: error.message };
  }
}

/**
 * Buscar dados por jogo e tipo
 */
async function getGameData(game, type = null, level = 1, limit = 50) {
  try {
    let query = supabase
      .from('scraped_data')
      .select('*')
      .eq('game', game.toLowerCase())
      .lte('level_required', level)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`❌ Erro ao buscar dados: ${error.message}`);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(`❌ Erro ao buscar dados: ${error.message}`);
    return [];
  }
}

/**
 * Buscar dados por múltiplos critérios
 */
async function searchData(filters = {}) {
  try {
    const {
      game,
      type,
      source,
      level = 1,
      minDate = null,
      maxDate = null,
      limit = 100
    } = filters;

    let query = supabase
      .from('scraped_data')
      .select('*')
      .lte('level_required', level)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (game) {
      query = query.eq('game', game.toLowerCase());
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (source) {
      query = query.eq('source', source);
    }

    if (minDate) {
      query = query.gte('timestamp', minDate);
    }

    if (maxDate) {
      query = query.lte('timestamp', maxDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`❌ Erro ao buscar dados: ${error.message}`);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(`❌ Erro ao buscar dados: ${error.message}`);
    return [];
  }
}

/**
 * Obter estatísticas de dados
 */
async function getStatistics(game = null) {
  try {
    let query = supabase
      .from('scraped_data')
      .select('type, source, count(*)');

    if (game) {
      query = query.eq('game', game.toLowerCase());
    }

    const { data, error } = await query;

    if (error) {
      console.error(`❌ Erro ao obter estatísticas: ${error.message}`);
      return {};
    }

    // Processar dados para estatísticas
    const stats = {
      total: 0,
      byType: {},
      bySource: {},
      byGame: {}
    };

    if (data) {
      data.forEach(item => {
        stats.total += item.count;
        stats.byType[item.type] = (stats.byType[item.type] || 0) + item.count;
        stats.bySource[item.source] = (stats.bySource[item.source] || 0) + item.count;
      });
    }

    return stats;
  } catch (error) {
    console.error(`❌ Erro ao obter estatísticas: ${error.message}`);
    return {};
  }
}

/**
 * Limpar dados antigos (mais de 30 dias)
 */
async function cleanOldData() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('scraped_data')
      .delete()
      .lt('timestamp', thirtyDaysAgo.toISOString());

    if (error) {
      console.error(`❌ Erro ao limpar dados antigos: ${error.message}`);
      return { success: false };
    }

    console.log(`✅ Dados antigos removidos`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Erro ao limpar dados: ${error.message}`);
    return { success: false };
  }
}

/**
 * Sincronizar dados de scraping com banco
 */
async function syncScrapedData(scrapedData) {
  try {
    console.log(`\n🔄 Iniciando sincronização com Supabase...`);
    
    // Verificar duplicatas
    const uniqueData = [];
    const seen = new Set();

    for (const item of scrapedData) {
      const key = `${item.game}-${item.type}-${item.title}-${item.source}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueData.push(item);
      }
    }

    console.log(`📊 ${uniqueData.length} itens únicos para sincronizar`);

    // Inserir dados
    const result = await insertScrapedData(uniqueData);

    if (result.success) {
      console.log(`✅ Sincronização completa! ${result.count} itens inseridos`);
    }

    return result;
  } catch (error) {
    console.error(`❌ Erro na sincronização: ${error.message}`);
    return { success: false, count: 0 };
  }
}

module.exports = {
  supabase,
  insertScrapedData,
  getGameData,
  searchData,
  getStatistics,
  cleanOldData,
  syncScrapedData
};
