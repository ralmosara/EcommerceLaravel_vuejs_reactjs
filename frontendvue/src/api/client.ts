import axios from 'axios'
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useToast } from 'vue-toastification'
import router from '@/router'

const toast = useToast()

// Create axios instance
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000,
  withCredentials: true
})

// Request interceptor - attach token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    if (!error.response) {
      // Network error
      toast.error('Connection failed. Please check your internet connection.')
      return Promise.reject(error)
    }

    const status = error.response.status

    switch (status) {
      case 401:
        // Unauthorized - clear auth and redirect to login
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        if (router.currentRoute.value.path !== '/login') {
          toast.error('Your session has expired. Please login again.')
          router.push({
            path: '/login',
            query: { redirect: router.currentRoute.value.fullPath }
          })
        }
        break

      case 403:
        toast.error('Access denied. You do not have permission to perform this action.')
        break

      case 404:
        toast.error('Resource not found.')
        break

      case 422:
        // Validation error - handle in component
        break

      case 429:
        toast.error('Too many requests. Please try again later.')
        break

      case 500:
      case 502:
      case 503:
        toast.error('Server error. Please try again later.')
        break

      default:
        const errorMessage = (error.response.data as { message?: string })?.message
        if (errorMessage) {
          toast.error(errorMessage)
        } else {
          toast.error('An unexpected error occurred.')
        }
    }

    return Promise.reject(error)
  }
)

export default apiClient
