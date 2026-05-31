import api from '../services/api'


const tipoByProfile = {
  "Consultor": "c",
  "Talent Manager": "t",
  "Service Line Lider": "s",
}

// Listar todos os Utilizadores
export const getUtilizadores = async () => {
  try {
    const response = await api.get('/utilizadores/get')
    return response.data
  } catch (error) {
    console.error('Erro ao obter utilizadores', error)
    throw error
  }
}

// Listar dados de um Utilizador
export const getUtilizadorById = async (id) => {
  try {
    const response = await api.get(`/utilizadores/${id}/get`)
    return response.data
  } catch (error) {
    console.error('Erro ao obter utilizadores', error)
    throw error
  }
}

// Criar um Utilizador
export const createUtilizador = async (payload) => {
  try {
    const response = await api.post('/utilizadores/create', payload)
    return response.data
  } catch (error) {
    console.error('Erro ao criar utilizador', error)
    throw error
  }
}

// Editar um Utilizador
export const updateUtilizador = async (id, payload) => {
  try {
    const response = await api.put(`/utilizadores/${id}/update`, payload)
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar utilizador', error)
    throw error
  }
}

// Listar dados do Consultor
export const getConsultor = async () => {
  try {
    const { id_consultor } = JSON.parse(atob(localStorage.getItem('token').split('.')[1]))
    const response = await api.get(`/consultores/${id_consultor}/publico`)
    return response.data
  } catch (error) {
    console.error('Erro ao obter dados do Consultor', error)
    throw error
  }
}

// Editar dados do Consultor
export const updatemeUtilizador = async (payload) => {
  try {
    const response = await api.put('/autenticacao/update-me', payload)
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar utilizador', error)
    throw error
  }
}

export { tipoByProfile }
