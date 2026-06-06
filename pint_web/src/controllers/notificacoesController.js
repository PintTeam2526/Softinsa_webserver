import api from '../services/api'


// Listar Notificações
export const getNotifications = async () => {
    try {
        const response = await api.get('/notificacoes/get')
        return response.data
    } catch (error) {
        console.error('Erro ao obter notificacoes', error)
        throw error
    }
}

// Criar uma Notificação (só para o Admin)
export const createNotification = async (payload) => {
    try {
        const response = await api.post('/notificacoes/post', payload)
        return response.data
    } catch (error) {
        console.error('Erro ao criar notificacao', error)
        throw error
    }
}
