import api from '../services/api'


// Obter Documentos de um Pedido (dentro de um .zip)
export const getDocumentosByPedido = async (id_pedido) => {
    try {
        const response = await api.get(`/documentos/pedido/${id_pedido}`, {
            responseType: 'blob',
        })
        return response.data
    } catch (error) {
        console.error(`Erro ao obter documentos do pedido ${id_pedido}`, error)
        throw error
    }
}

// Obter Documento de um Requisito
export const getDocumentoByRequisito = async (id_pedido, id_requisito) => {
    try {
        const response = await api.get(`/documentos/pedido/${id_pedido}/requisito/${id_requisito}`)
        return response.data
    } catch (error) {
        console.error(`Erro ao obter documento do requisito ${id_requisito}`, error)
        throw error
    }
}