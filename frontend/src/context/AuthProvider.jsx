import { useState, useCallback } from 'react'
import { AuthContext } from './authContext'
import { getStorage, TOKEN_KEY, USER_KEY, PERSIST_KEY } from './authStorage'

const BACKEND = import.meta.env.VITE_API_URL || 'https://ctd-vantage.onrender.com'

function readStoredAuth() {
  const storage = getStorage()
  const storedToken = storage.getItem(TOKEN_KEY)
  const storedUser = storage.getItem(USER_KEY)
  return {
    token: storedToken,
    user: storedToken ? (storedUser ? JSON.parse(storedUser) : { name: 'User' }) : null,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredAuth().user)
  const [token, setTokenState] = useState(() => readStoredAuth().token)

  const setToken = useCallback((newToken, persist = false) => {
    const storage = persist ? localStorage : sessionStorage
    if (newToken) {
      storage.setItem(TOKEN_KEY, newToken)
      if (persist) storage.setItem(PERSIST_KEY, 'true')
    } else {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(PERSIST_KEY)
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(USER_KEY)
    }
    setTokenState(newToken)
  }, [])

  const login = useCallback(async (email, password, keepSignedIn = false) => {
    const res = await fetch(`${BACKEND}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.msg || data.message || 'Login failed')
    setUser(data.user || { name: email })
    setToken(data.token, keepSignedIn)
    if (keepSignedIn && data.user) {
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      } catch {
        console.error('Failed to store user data in localStorage')
      }
    }
    return data
  }, [setToken])

  const signInWithToken = useCallback((data, persist = false) => {
    setUser(data.user || { name: 'User' })
    setToken(data.token, persist)
    if (persist && data.user) {
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      } catch {
        console.error('Failed to store user data in localStorage')
      }
    }
  }, [setToken])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
  }, [setToken])

  const value = { user, token, login, logout, signInWithToken }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
