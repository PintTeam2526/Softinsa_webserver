import api from '../services/api'

export const getPedidos = async () => {
    try {
        const response = await api.get('/pedidos/get')
        return response.data
    } catch (error) {
        console.error('Erro ao obter pedidos', error)
        throw error
    }
}

export const getPedidoById = async (id) => {
    try {
        const response = await api.get(`/pedidos/${id}/get`)
        return response.data
    } catch (error) {
        console.error(`Erro ao obter pedido ${id}`, error)
        throw error
    }
}

export const getPedidoHistorico = async (id) => {
    try {
        const response = await api.get(`/pedidos/${id}/historico`)
        return response.data
    } catch (error) {
        console.error(`Erro ao obter histórico do pedido ${id}`, error)
        throw error
    }
}

export const createPedido = async (payload) => {
    try {
        const response = await api.post('/pedidos/create', payload)
        return response.data
    } catch (error) {
        console.error('Erro ao criar pedido', error)
        throw error
    }
}

export const tmReview = async (id, payload) => {
    try {
        const response = await api.post(`/pedidos/${id}/tm-review`, payload)
        return response.data
    } catch (error) {
        console.error('Erro na revisão TM', error)
        throw error
    }
}

export const slReview = async (id, payload) => {
    try {
        const response = await api.post(`/pedidos/${id}/sl-review`, payload)
        return response.data
    } catch (error) {
        console.error('Erro na revisão SL', error)
        throw error
    }
}

export const getDocumentacao = async () => {
    try {
        const response = await api.get('/candidaturas/documentacao')
        return response.data
    } catch (error) {
        console.error('Erro ao obter documentação de candidaturas', error)
        throw error
    }
}

export const uploadDocumentacao = async (payload) => {
    try {
        const response = await api.post('/candidaturas/documentacao', payload,)
        return response.data
    } catch (error) {
        console.error('Erro ao enviar documentação', error)
        throw error
    }
}
