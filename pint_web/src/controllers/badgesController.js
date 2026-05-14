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