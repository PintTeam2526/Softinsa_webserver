import api from '../services/api'

const tipoByProfile = {
  "Consultor": "c",
  "Talent Manager": "t",
  "Service Line Lider": "s",
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

export const updateUtilizador = async (id, payload) => {
  const response = await api.put(`/utilizadores/${id}/update`, payload)
  return response.data
}

export { tipoByProfile }