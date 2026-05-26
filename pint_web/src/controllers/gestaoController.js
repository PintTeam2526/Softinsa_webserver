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
