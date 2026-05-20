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

export const createRequisito = async (payload) => {
    try {
        const response = await api.post('/requisitos/create', payload)
        return response.data
    } catch (error) {
        console.error('Erro ao criar requisito', error.response?.data ?? error)
        throw error
    }
}

export const updateRequisito = async (id, payload) => {
    try {
        const response = await api.put(`/requisitos/${id}/update`, payload)
        return response.data
    } catch (error) {
        console.error(`Erro ao atualizar requisito ${id}`, error)
        throw error
    }
}

export const deleteRequisito = async (id) => {
    try {
        const response = await api.delete(`/requisitos/${id}/delete`)
        return response.data
    } catch (error) {
        console.error(`Erro ao apagar requisito ${id}`, error)
        throw error
    }
}