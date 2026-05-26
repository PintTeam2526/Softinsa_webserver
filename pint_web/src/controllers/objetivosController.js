import api from '../services/api'


// Listar Objetivos do Consultor
export const getMeusObjetivos = async () => {
    try {
        const response = await api.get('/objetivos/meus')
        return response.data
    } catch (error) {
        console.error('Erro ao obter objetivos', error)
        throw error
    }
}

// Listar Objetivos Disponiveis do Consultor (Badges Por Obter)
export const getBadgesDisponiveisObjetivos = async () => {
    try {
        const response = await api.get('/objetivos/badges-disponiveis')
        return response.data
    } catch (error) {
        console.error('Erro ao obter objetivos disponiveis', error)
        throw error
    }
}

// Criar Objetivo
export const criarObjetivo = async (payload) => {
    try {
        const response = await api.post('/objetivos/criar', payload)
        return response.data
    } catch (error) {
        console.error('Erro ao criar objetivo', error)
        throw error
    }
}
