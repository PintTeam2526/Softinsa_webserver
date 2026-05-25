import api from '../services/api'

export const getAreas = async () => {
  try {
    const response = await api.get('/areas/get')
    return response.data
  } catch (error) {
    console.error('Erro ao obter areas', error)
    throw error
  }
}

export const createArea = async (payload) => {
  try {
    const response = await api.post('/areas/create', payload)
    return response.data
  } catch (error) {
    console.error('Erro ao criar area', error)
    throw error
  }
}

export const updateArea = async (id, payload) => {
  try {
    const response = await api.put(`/areas/${id}/update`, payload)
    return response.data.dados
  } catch (error) {
    console.error('Erro ao atualizar area', error)
    throw error
  }
}