import { AUTH_TOKEN_KEY, AUTH_USER_KEY, getStoredToken } from './http'

export function getStoredUser() {
  try {
    const serialized =
      localStorage.getItem(AUTH_USER_KEY) ||
      sessionStorage.getItem(AUTH_USER_KEY)
    return serialized ? JSON.parse(serialized) : null
  } catch (_) {
    return null
  }
}

export function persistSession({ token, user }, remember) {
  const sanitizedUser = user ?? null
  const storage = remember ? localStorage : sessionStorage
  const altStorage = remember ? sessionStorage : localStorage

  storage.setItem(AUTH_TOKEN_KEY, token)
  storage.setItem(AUTH_USER_KEY, JSON.stringify(sanitizedUser))

  altStorage.removeItem(AUTH_TOKEN_KEY)
  altStorage.removeItem(AUTH_USER_KEY)
}

export function clearSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_USER_KEY)
}

export function isAuthenticated() {
  return Boolean(getStoredToken())
}

export const sessionService = {
  getToken: () => getStoredToken(),
  getCurrentUser: () => getStoredUser(),
  persistSession,
  clearSession,
  isAuthenticated
}

