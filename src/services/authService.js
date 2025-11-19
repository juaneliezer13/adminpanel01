import { api } from './http'

export async function login(payload) {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export async function requestPasswordReset(email) {
  const { data } = await api.post('/auth/forgot-password', { email })
  return data
}

