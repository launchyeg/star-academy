import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Guards dashboard routes behind the real Supabase auth session.
 * Waits for the initial session check to finish before deciding, so a
 * refresh doesn't briefly bounce an already-logged-in admin to /login.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
