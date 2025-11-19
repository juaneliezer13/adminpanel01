import axios from 'axios'

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api'
const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

const getStoredToken = () =>
  localStorage.getItem(AUTH_TOKEN_KEY) ||
  sessionStorage.getItem(AUTH_TOKEN_KEY)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
})

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      sessionStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
      sessionStorage.removeItem(AUTH_USER_KEY)
    }
    return Promise.reject(error)
  }
)

export { api, AUTH_TOKEN_KEY, AUTH_USER_KEY, getStoredToken }

