import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from './admin/loading-screen'

/**
 * Proteksi rute opsional untuk area publik.
 * Bila `requireAdmin = true`, hanya pengguna dengan peran
 * admin/editor yang boleh lewat.
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) return <Navigate to="/login" replace />
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />
  return children
}