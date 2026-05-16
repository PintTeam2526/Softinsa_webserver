import api from '../services/api'

export const getBadges = async () => {
  try {
    const response = await api.get('/badges/get')
    return response.data
  } catch (error) {
    console.error('Erro ao obter badges', error)
    throw error
  }
}

export const createBadge = async (payload) => {
  try {
    const response = await api.post('/badges/create', payload)
    return response.data
  } catch (error) {
    console.error('Erro ao criar badge', error)
    throw error
  }
}

export const updateBadge = async (id, payload) => {
  try {
    const response = await api.put(`/badges/${id}/update`, payload)
    return response.data.dados
  } catch (error) {
    console.error('Erro ao atualizar badge', error)
    throw error
  }
}
