import axios from 'axios'

import { clearToken } from './auth'

const api = axios.create({
    baseURL: 'https://softinsa-api-rw5t.onrender.com/api',
})

// Sacar o token para o localStorage e colocar em todos os pedidos
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') ?? sessionStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Caso o token expire -> redireciona para a página do login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearToken()
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api