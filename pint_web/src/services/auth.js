
export function getToken() {
    return localStorage.getItem('token') ?? sessionStorage.getItem('token') ?? null
}

export function clearToken() {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
}
