import api from '../services/api'


// Listar Pedidos
export const getPedidos = async () => {
    try {
        const response = await api.get('/pedidos/get')
        return response.data
    } catch (error) {
        console.error('Erro ao obter pedidos', error)
        throw error
    }
}

// Listar de um Pedido
export const getPedidoById = async (id) => {
    try {
        const response = await api.get(`/pedidos/${id}/get`)
        return response.data
    } catch (error) {
        console.error(`Erro ao obter pedido ${id}`, error)
        throw error
    }
}

// Listar Historico de um Pedido
export const getPedidoHistorico = async (id) => {
    try {
        const response = await api.get(`/pedidos/${id}/historico`)
        return response.data
    } catch (error) {
        console.error(`Erro ao obter histórico do pedido ${id}`, error)
        throw error
    }
}

// Criar um Pedido
export const createPedido = async (payload) => {
    try {
        const response = await api.post('/pedidos/create', payload)
        return response.data
    } catch (error) {
        console.error('Erro ao criar pedido', error)
        throw error
    }
}

// Avaliar um Pedido (TM)
export const tmReview = async (id, payload) => {
    try {
        const response = await api.post(`/pedidos/${id}/tm-review`, payload)
        return response.data
    } catch (error) {
        console.error('Erro na revisão TM', error)
        throw error
    }
}

// Avaliar um Pedido (SLL)
export const slReview = async (id, payload) => {
    try {
        const response = await api.post(`/pedidos/${id}/sl-review`, payload)
        return response.data
    } catch (error) {
        console.error('Erro na revisão SL', error)
        throw error
    }
}

// Obter Documentacao de um Pedido
export const getDocumentacao = async () => {
    try {
        const response = await api.get('/candidaturas/documentacao')
        return response.data
    } catch (error) {
        console.error('Erro ao obter documentação de candidaturas', error)
        throw error
    }
}

// Enviar Documentacao de um Pedido
export const uploadDocumentacao = async (payload) => {
    try {
        const response = await api.post('/candidaturas/documentacao', payload,)
        return response.data
    } catch (error) {
        console.error('Erro ao enviar documentação', error)
        throw error
    }
}
