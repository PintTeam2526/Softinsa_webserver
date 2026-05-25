import api from '../services/api'

export const getMeusObjetivos = async () => {
    const response = await api.get('/objetivos/meus')
    console.log(response);
    return response.data
}

export const getBadgesDisponiveisObjetivos = async () => {
    const response = await api.get('/objetivos/badges-disponiveis')
    return response.data
}

export const criarObjetivo = async (payload) => {
    const response = await api.post('/objetivos/criar', payload)
    return response.data
}
