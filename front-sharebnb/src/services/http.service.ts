// src/services/http.service.js (CLIENT)
import Axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api/'
    : '//localhost:3030/api/'

const axios = Axios.create({ withCredentials: true })

export const httpService: HttpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint: string, method = 'GET', data = null) {
    const url = `${BASE_URL}${endpoint}`
    const params = (method === 'GET') ? data : null
    const options = { url, method, data, params }

    try {
        const res = await axios(options)
        return res.data
    } catch (err: unknown) {
        console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data)
        console.dir(err)

        if (Axios.isAxiosError(err)) {
            if (err.response && err.response.status === 401) {
                sessionStorage.clear()
                window.location.assign('/')
            }
        }
        throw err
    }
}

interface HttpService {
    get<T = any>(endpoint: string, data?: any): Promise<T>
    post<T = any>(endpoint: string, data?: any): Promise<T>
    put<T = any>(endpoint: string, data?: any): Promise<T>
    delete<T = any>(endpoint: string, data?: any): Promise<T>
}