import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const AUTH_STORAGE_KEY = 'star_academy_auth'

/**
 * Frontend-only auth, checked against VITE_ADMIN_USERNAME / VITE_ADMIN_PASSWORD
 * from the local .env file. There is no backend/API call here — this is a
 * temporary client-side gate and will later be replaced by a real auth service.
 * The logged-in flag is persisted to localStorage so a page refresh keeps the
 * admin signed in.
 */
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  )
  const [admin, setAdmin] = useState(() => {
    const savedUsername = localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
      ? localStorage.getItem('star_academy_admin_name')
      : null
    return savedUsername ? { name: savedUsername } : null
  })

  function login(username, password) {
    if (!username.trim() || !password.trim()) {
      return { success: false, message: 'من فضلك أدخل اسم المستخدم وكلمة المرور' }
    }

    const validUsername = import.meta.env.VITE_ADMIN_USERNAME
    const validPassword = import.meta.env.VITE_ADMIN_PASSWORD

    if (username !== validUsername || password !== validPassword) {
      return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' }
    }

    setIsAuthenticated(true)
    setAdmin({ name: username })
    localStorage.setItem(AUTH_STORAGE_KEY, 'true')
    localStorage.setItem('star_academy_admin_name', username)
    return { success: true }
  }

  function logout() {
    setIsAuthenticated(false)
    setAdmin(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem('star_academy_admin_name')
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
