import api from '../services/api'


// Listar todos os LPs
export const getLearningPaths = async () => {
  try {
    const response = await api.get('/learningPaths/get')
    return response.data
  } catch (error) {
    console.error('Erro ao obter learning paths', error)
    throw error
  }
}

// Criar um LP
export const createLearningPath = async (payload) => {
  try {
    const response = await api.post('/learningPaths/create', payload)
    return response.data
  } catch (error) {
    console.error('Erro ao criar learning path', error)
    throw error
  }
}

// Editar um LP
export const updateLearningPath = async (id, payload) => {
  try {
    const response = await api.put(`/learningPaths/${id}/update`, payload)
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar learning path', error)
    throw error
  }
}
