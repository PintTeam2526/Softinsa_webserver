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