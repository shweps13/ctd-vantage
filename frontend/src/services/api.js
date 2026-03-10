import axios from 'axios'
import { getAuthToken, getId } from '../context/authStorage'

const baseURL = import.meta.env.VITE_API_URL || import.meta.env.BACKEND_URL || ''

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use((config) => {
    const token = getAuthToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized:', error.response.data)
        }
        return Promise.reject(error)
    }
)


export const balancesApi = {
    getAll(userId = getId()) {
        return api.get(`/api/v1/users/${userId}/balances`)
    },

    getOne(balanceId, userId = getId()) {
        return api.get(`/api/v1/users/${userId}/balances/${balanceId}`)
    },

    getDetails(balanceId, userId = getId(), params = {}) {
        return api.get(`/api/v1/users/${userId}/balances/${balanceId}`, { params })
    },

    create(payload, userId = getId()) {
        return api.post(`/api/v1/users/${userId}/balances`, payload)
    },

    update(balanceId, payload, userId = getId()) {
        return api.patch(`/api/v1/users/${userId}/balances/${balanceId}`, payload)
    },

    delete(balanceId, userId = getId()) {
        return api.delete(`/api/v1/users/${userId}/balances/${balanceId}`)
    },
}

export default api
