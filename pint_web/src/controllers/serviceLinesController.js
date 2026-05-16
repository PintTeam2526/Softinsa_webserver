import api from '../services/api'

export const getServiceLines = async () => {
  try {
    const response = await api.get('/serviceLines/get')
    return response.data
  } catch (error) {
    console.error('Erro ao obter service lines', error)
    throw error
  }
}

export const createServiceLine = async (payload) => {
  try {
    const response = await api.post(
      '/serviceLines/create',
      payload
    )

    return response.data
  } catch (error) {
    console.error('Erro ao criar service line', error)
    throw error
  }
}

export const updateServiceLine = async (
  id,
  payload
) => {
  try {
    const response = await api.put(
      `/serviceLines/${id}/update`,
      payload
    )

    return response.data.dados
  } catch (error) {
    console.error('Erro ao atualizar service line', error)
    throw error
  }
}