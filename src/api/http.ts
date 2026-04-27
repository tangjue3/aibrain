import axios from 'axios'
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

const http: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    const message = error.response?.status === 401
      ? '登录已过期，请重新登录'
      : error.response?.status === 500
        ? '服务器内部错误'
        : error.message || '网络错误'
    console.error(`[HTTP Error] ${error.response?.status}: ${message}`)
    return Promise.reject(error)
  }
)

export default http
