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

export function getId() {
  try {
    const token = getAuthToken()
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    return payload?.userId ?? null
  } catch {
    return null
  }
}
