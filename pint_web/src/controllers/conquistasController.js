import api from '../services/api'


// Listar todas as Conquistas do Consultor
export async function getConquistasConsultor() {
  try {
    const response = await api.get('/conquistas/get/consultor')
    return response.data
  } catch (error) {
    console.error('Erro ao obter as conquistas do consultor', error)
    throw error
  }
}
