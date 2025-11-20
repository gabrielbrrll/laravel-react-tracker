import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - Clear token and redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }

      // Handle 429 Too Many Requests
      if (error.response.status === 429) {
        console.error('Rate limit exceeded. Please try again later.')
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
