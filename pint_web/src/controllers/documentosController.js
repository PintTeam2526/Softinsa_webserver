import api from '../services/api'

export const getDocumentosByPedido = async (id_pedido) => {
    try {
        const response = await api.get(`/documentos/pedido/${id_pedido}`, {
            responseType: 'blob', // ZIP é binário
        })
        return response.data
    } catch (error) {
        console.error(`Erro ao obter documentos do pedido ${id_pedido}`, error)
        throw error
    }
}

export const getDocumentoByRequisito = async (id_pedido, id_requisito) => {
    try {
        const response = await api.get(`/documentos/pedido/${id_pedido}/requisito/${id_requisito}`)
        return response.data
    } catch (error) {
        console.error(`Erro ao obter documento do requisito ${id_requisito}`, error)
        throw error
    }
}