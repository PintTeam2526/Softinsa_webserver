import api from '../services/api'

export async function getCertificado() {
  const response = await api.get('/gestao/certificado')
  return response.data
}
