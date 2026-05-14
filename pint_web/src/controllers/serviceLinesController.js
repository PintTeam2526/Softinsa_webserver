import api from '../services/api'

export const getServiceLines = async () => {
  try {
    const response = await api.get('/serviceLines/get')
    return response.data
  } catch (error) {
    console.error('Erro ao obter service lines', error)
    throw error
  }
}