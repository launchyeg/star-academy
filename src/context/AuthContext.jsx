import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

/**
 * Real auth backed by Supabase (email/password). The admin account is
 * created directly in the Supabase dashboard (Authentication > Users) —
 * there is no public sign-up. The session is managed by supabase-js itself
 * (persisted under the hood), so a page refresh keeps the admin signed in
 * until they log out or the session expires.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // True until the initial session check finishes, so ProtectedRoute doesn't
  // bounce a still-logged-in admin to /login while that check is in flight.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function login(email, password) {
    if (!email.trim() || !password.trim()) {
      return { success: false, message: 'من فضلك أدخل البريد الإلكتروني وكلمة المرور' }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
    }

    setSession(data.session)
    return { success: true }
  }

  async function logout() {
    await supabase.auth.signOut()
    setSession(null)
  }

  const value = {
    isAuthenticated: Boolean(session),
    admin: session ? { name: session.user.email } : null,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
