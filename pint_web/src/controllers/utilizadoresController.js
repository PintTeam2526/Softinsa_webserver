import api from '../services/api'

const tipoByProfile = {
  "Consultor":         "c",
  "Talent Manager":    "t",
  "Service Line Lider":"s",
}

export const getUtilizadores = async () => {
  const response = await api.get('/utilizadores/get')
  return response.data
}

export const getUtilizadorById = async (id) => {
  const response = await api.get(`/utilizadores/${id}/get`)
  return response.data
}

export const createUtilizador = async (payload) => {
  const response = await api.post('/utilizadores/create', payload)
  return response.data
}

export const inativarUtilizador = async (id) => {
  const response = await api.delete(`/utilizadores/${id}/delete`)
  return response.data
}

export { tipoByProfile }