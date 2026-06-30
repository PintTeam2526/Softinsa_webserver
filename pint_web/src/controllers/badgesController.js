import api from '../services/api'


// Listar todos os Badges
export const getBadges = async () => {
  try {
    const response = await api.get('/badges/get')
    return response.data
  } catch (error) {
    console.error('Erro ao obter badges', error)
    throw error
  }
}

// Listar dados de um Badge
export const getBadgeById = async (id) => {
  try {
    const response = await api.get(`/badges/${id}/get`)
    return response.data
  } catch (error) {
    console.error(`Erro ao obter badge ${id}`, error)
    throw error
  }
}

// Criar um Badge
export const createBadge = async (payload) => {
  try {
    const response = await api.post('/badges/create', payload)
    return response.data.dados ?? response.data
  } catch (error) {
    console.error('Erro ao criar badge', error)
    throw error
  }
}

// Editar um Badge
export const updateBadge = async (id, payload) => {
  try {
    const response = await api.put(`/badges/${id}/update`, payload)
    return response.data.dados
  } catch (error) {
    console.error('Erro ao atualizar badge', error)
    throw error
  }
}

// Listar Badges Favoritos
export const getFavoritos = async () => {
  try {
    const response = await api.get('/badges/favorito')
    return response.data
  } catch (error) {
    console.error('Erro ao obter badges favoritos', error)
    throw error
  }
}

// Marcar um Badge como Favorito
export const setFavorito = async (id_badge, set) => {
  try {
    const response = await api.post('/badges/favorito/set', { id_badge, set })
    return response.data
  } catch (error) {
    console.error(`Erro ao marcar o badge ${id_badge} como favorito`, error)
    throw error
  }
}

// Listar Badges Em Analise
export const getBadgesEmAnalise = async () => {
  try {
    const response = await api.get('/badges/emAnalize')
    return response.data
  } catch (error) {
    console.error('Erro ao obter badges em analise', error)
    throw error
  }
}

// Listar Badges Obtidos
export const getBadgesObtidos = async () => {
  try {
    const response = await api.get('/badges/obtidos')
    return response.data
  } catch (error) {
    console.error('Erro ao obter badges obtidos', error)
    throw error
  }
}

// Listar Badges Por Obter
export const getBadgesPorObter = async () => {
  try {
    const response = await api.get('/badges/porObter')
    return response.data
  } catch (error) {
    console.error('Erro ao obter badges por obter', error)
    throw error
  }
}

// Listar Badges Expirados
export const getBadgesExpirados = async () => {
  try {
    const response = await api.get('/badges/expirados')
    return response.data
  } catch (error) {
    console.error('Erro ao obter badges expirados', error)
    throw error
  }
}

// Listar Badges Devolvidos
export const getBadgesDevolvidos = async () => {
  try {
    const response = await api.get('/badges/devolvidos')
    return response.data
  } catch (error) {
    console.error('Erro ao obter badges devolvidos', error)
    throw error
  }
}

// Listar Badges Recomendados
export const getBadgesRecomendados = async () => {
  try {
    const response = await api.get('/badges/recomendados')
    return response.data
  } catch (error) {
    console.error('Erro ao obter badges recomendados', error)
    throw error
  }
}

// Partilhar o Badge por LinkedIn
export const getBadgeShareUrl = (id) => {
  const base = api.defaults.baseURL.replace(/\/$/, '')
  return `${base}/badges/${id}/share`
}
