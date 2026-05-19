import api from '../services/api'

export const getRequisitosByBadge = async (id_badge) => {
    try {
        const response = await api.get(`/requisitos/get/${id_badge}/requisitos`)
        return response.data
    } catch (error) {
        console.error(`Erro ao obter requisitos do badge ${id_badge}`, error)
        throw error
    }
}

export const getRequisitoById = async (id) => {
    try {
        const response = await api.get(`/requisitos/${id}/get`)
        return response.data
    } catch (error) {
        console.error(`Erro ao obter requisito ${id}`, error)
        throw error
    }
}

export const getAllRequisitos = async () => {
    try {
        const response = await api.get('/requisitos/get')
        return response.data
    } catch (error) {
        console.error('Erro ao listar requisitos', error)
        throw error
    }
}