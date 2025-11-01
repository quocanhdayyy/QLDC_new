"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Simulate checking if user is already logged in (from localStorage)
  useEffect(() => {
      const storedUser = localStorage.getItem("user")
      const token = localStorage.getItem('token')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      if (token) {
        try {
          // set default Authorization for axios instance
          import('../services').then(m => {
            const api = m.default
            if (api) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          }).catch(() => null)
        } catch (e) {}
      }
      setLoading(false)
    }, [])

    const login = (userData, token) => {
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      if (token) {
        localStorage.setItem('token', token)
        import('../services').then(m => {
          const api = m.default
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }).catch(() => {})
      }
    }

    const logout = () => {
      setUser(null)
      localStorage.removeItem("user")
      localStorage.removeItem('token')
      import('../services').then(m => { const api = m.default; if (api) delete api.defaults.headers.common['Authorization'] }).catch(() => {})
    }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
