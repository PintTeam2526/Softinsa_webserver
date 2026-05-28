import api from '../services/api'


// Obter dados para Certificados (Consultor + Badge Concluido)
export async function getCertificado() {
  try {
    const response = await api.get('/gestao/certificado')
    return response.data
  } catch (error) {
    console.error('Erro ao obter dados do certificado', error)
    throw error
  }
}

// Obter dados para Rankings
export async function getRanking() {
  try {
    const response = await api.get('/gestao/rank')
    return response.data
  } catch (error) {
    console.error('Erro ao obter dados do ranking', error)
    throw error
  }
}

// Obter dados para Estatisticas dos Relatorio (de acordo com os filtros enviados)
export async function getRelatorio(body = {}) {
  try {
    const response = await api.post('/gestao/relatorio', body)
    return response.data
  } catch (error) {
    console.error('Erro ao obter dados do relatorio', error)
    throw error
  }
}

// Listar as politicas RGPD
export async function getRGPD() {
  try {
    const response = await api.get('/gestao/rgpd/get')
    return response.data
  } catch (error) {
    console.error('Erro ao obter dados das politicas RGPD', error)
    throw error
  }
}

// Editar as politicas RGPD
export const updateRGPD = async (payload) => {
  try {
    const response = await api.put('/gestao/rgpd/update', payload)
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar politicas RGPD', error)
    throw error
  }
}
