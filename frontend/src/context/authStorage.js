export const TOKEN_KEY = 'auth_token'
export const USER_KEY = 'auth_user'
export const PERSIST_KEY = 'auth_persist'

export function getStorage() {
  try {
    return localStorage.getItem(PERSIST_KEY) === 'true' ? localStorage : sessionStorage
  } catch {
    return sessionStorage
  }
}

export function getAuthToken() {
  try {
    const storage = getStorage()
    return storage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}
