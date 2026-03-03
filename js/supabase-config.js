// Supabase Configuration
// Substitua com suas credenciais do Supabase

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sua-chave-anonima-aqui';

// Importar Supabase (será carregado via CDN no HTML)
// import { createClient } from '@supabase/supabase-js';

// Criar cliente Supabase
let supabase = null;

async function initSupabase() {
  if (typeof window.supabase !== 'undefined') {
    const { createClient } = window.supabase;
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase inicializado');
    return supabase;
  }
}

// Funções de Autenticação
async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  
  if (error) {
    console.error('Erro ao registrar:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true, user: data.user };
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  
  if (error) {
    console.error('Erro ao fazer login:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true, user: data.user };
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Erro ao fazer logout:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// Funções de Usuários
async function getUser(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Erro ao buscar usuário:', error.message);
    return null;
  }
  
  return data;
}

async function updateUser(userId, updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);
  
  if (error) {
    console.error('Erro ao atualizar usuário:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

// Funções de Guias
async function getGuides(game = null) {
  let query = supabase.from('guides').select('*');
  
  if (game) {
    query = query.eq('game', game);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Erro ao buscar guias:', error.message);
    return [];
  }
  
  return data;
}

async function getGuideById(id) {
  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Erro ao buscar guia:', error.message);
    return null;
  }
  
  return data;
}

async function createGuide(guide) {
  const { data, error } = await supabase
    .from('guides')
    .insert([guide]);
  
  if (error) {
    console.error('Erro ao criar guia:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

// Funções de Anúncios
async function getAds() {
  const { data, error } = await supabase
    .from('advertisements')
    .select('*');
  
  if (error) {
    console.error('Erro ao buscar anúncios:', error.message);
    return [];
  }
  
  return data;
}

async function createAd(ad) {
  const { data, error } = await supabase
    .from('advertisements')
    .insert([ad]);
  
  if (error) {
    console.error('Erro ao criar anúncio:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

async function deleteAd(id) {
  const { error } = await supabase
    .from('advertisements')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Erro ao deletar anúncio:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// Funções de Parceiros
async function getPartners() {
  const { data, error } = await supabase
    .from('partners')
    .select('*');
  
  if (error) {
    console.error('Erro ao buscar parceiros:', error.message);
    return [];
  }
  
  return data;
}

async function createPartner(partner) {
  const { data, error } = await supabase
    .from('partners')
    .insert([partner]);
  
  if (error) {
    console.error('Erro ao criar parceiro:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

async function deletePartner(id) {
  const { error } = await supabase
    .from('partners')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Erro ao deletar parceiro:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// Funções de Receita
async function getRevenue() {
  const { data, error } = await supabase
    .from('revenue')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Erro ao buscar receita:', error.message);
    return [];
  }
  
  return data;
}

async function createRevenue(revenue) {
  const { data, error } = await supabase
    .from('revenue')
    .insert([revenue]);
  
  if (error) {
    console.error('Erro ao criar receita:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

// Funções de Chat
async function getChatMessages(game = null) {
  let query = supabase
    .from('chat_messages')
    .select('*, users(username)')
    .order('created_at', { ascending: false });
  
  if (game) {
    query = query.eq('game', game);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Erro ao buscar mensagens:', error.message);
    return [];
  }
  
  return data;
}

async function sendChatMessage(userId, message, game = null) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([{
      user_id: userId,
      message: message,
      game: game
    }]);
  
  if (error) {
    console.error('Erro ao enviar mensagem:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

// Funções de Favoritos
async function getFavorites(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*, guides(*)')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Erro ao buscar favoritos:', error.message);
    return [];
  }
  
  return data;
}

async function addFavorite(userId, guideId) {
  const { data, error } = await supabase
    .from('favorites')
    .insert([{
      user_id: userId,
      guide_id: guideId
    }]);
  
  if (error) {
    console.error('Erro ao adicionar favorito:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

async function removeFavorite(userId, guideId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('guide_id', guideId);
  
  if (error) {
    console.error('Erro ao remover favorito:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// Exportar funções
export {
  initSupabase,
  signUp,
  signIn,
  signOut,
  getUser,
  updateUser,
  getGuides,
  getGuideById,
  createGuide,
  getAds,
  createAd,
  deleteAd,
  getPartners,
  createPartner,
  deletePartner,
  getRevenue,
  createRevenue,
  getChatMessages,
  sendChatMessage,
  getFavorites,
  addFavorite,
  removeFavorite
};
