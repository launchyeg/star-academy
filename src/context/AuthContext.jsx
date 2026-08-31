import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

/**
 * Frontend-only mock authentication.
 * There is no backend/API call here — logging in simply marks the
 * session as authenticated in React state. This will later be replaced
 * by a real authentication service.
 */
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [admin, setAdmin] = useState(null)

  function login(username, password) {
    if (!username.trim() || !password.trim()) {
      return { success: false, message: 'من فضلك أدخل اسم المستخدم وكلمة المرور' }
    }

    // Mock authentication: any non-empty credentials succeed.
    setIsAuthenticated(true)
    setAdmin({ name: username })
    return { success: true }
  }

  function logout() {
    setIsAuthenticated(false)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
