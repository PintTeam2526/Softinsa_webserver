import api from '../services/api'

export async function getConquistasConsultor() {
  const response = await api.get('/conquistas/get/consultor')
  return response.data
}
