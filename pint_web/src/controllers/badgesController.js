import api from '../services/api'

// ── Gerais ────────────────────────────────────────────────────────────────────

export const getBadges = async () => {
  const response = await api.get('/badges/get')
  return response.data
}

export const getBadgeById = async (id) => {
  const response = await api.get(`/badges/${id}/get`)
  return response.data
}

export const createBadge = async (payload) => {
  const response = await api.post('/badges/create', payload)
  return response.data.dados ?? response.data
}

export const updateBadge = async (id, payload) => {
  const response = await api.put(`/badges/${id}/update`, payload)
  return response.data.dados
}

// ── Filtros do consultor ──────────────────────────────────────────────────────

export const getFavoritos = async () => {
  const response = await api.get('/badges/favorito')
  return response.data
}

export const setFavorito = async (id_badge, set) => {
  const response = await api.post('/badges/favorito/set', { id_badge, set })
  return response.data
}

export const getBadgesEmAnalise = async () => {
  const response = await api.get('/badges/emAnalize')
  return response.data
}

export const getBadgesObtidos = async () => {
  const response = await api.get('/badges/obtidos')
  return response.data
}

export const getBadgesPorObter = async () => {
  const response = await api.get('/badges/porObter')
  return response.data
}

export const getBadgesExpirados = async () => {
  const response = await api.get('/badges/expirados')
  return response.data
}

export const getBadgesDevolvidos = async () => {
  const response = await api.get('/badges/devolvidos')
  return response.data
}