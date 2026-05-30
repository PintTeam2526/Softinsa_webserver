import api from '../services/api'


// Para chamar a rota do back com os dados do consultor
export async function getDashboardConsultor() {
  try {
    const response = await api.get('/dashboard/consultor')
    return response.data
  } catch (error) {
    console.error('Erro ao obter dados da dashboard', error)
    throw error
  }
}

// Para chamar a rota do back com os dados do TM
export async function getDashboardTM() {
  try {
    const response = await api.get('/dashboard/tm')
    return response.data
  } catch (error) {
    console.error('Erro ao obter dados da dashboard', error)
    throw error
  }
}

// Para chamar a rota do back com os dados do SLL
export async function getDashboardSLL() {
  try {
    const response = await api.get('/dashboard/sll')
    return response.data
  } catch (error) {
    console.error('Erro ao obter dados da dashboard', error)
    throw error
  }
}

// Para chamar a rota do back com os dados do Admin
export const getDashboardAdmin = async (ano) => {
  try {
    const response = await api.get('/dashboard/admin', { params: { ano } })
    console.log('Dados da Dashboard Admin:', response.data) // RETIRAR DEPOIS
    return response.data
  } catch (error) {
    console.error('Erro ao obter dados da dashboard', error)
    throw error
  }
}
