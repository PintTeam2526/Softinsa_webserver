import api from '../services/api'

export const getLearningPaths = async () => {
  try {
    const response = await api.get('/learningPaths/get')
    return response.data
  } catch (error) {
    console.error('Erro ao obter learning paths', error)
    throw error
  }
}