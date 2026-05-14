import api from '../services/api'

export const getLearningPaths = async () => {
  const response = await api.get('/learningPaths/get')
  return response.data
}

export const createLearningPath = async (payload) => {
  const response = await api.post('/learningPaths/create', payload)
  return response.data
}

export const updateLearningPath = async (id, payload) => {
  const response = await api.put(`/learningPaths/${id}/update`, payload)
  return response.data
}

