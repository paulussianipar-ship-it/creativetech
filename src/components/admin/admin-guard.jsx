import { Link, Navigate, useLocation } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import LoadingScreen from '@/components/admin/loading-screen'

/**
 * AdminGuard — penjaga rute /admin/*.
 *
 * • Sambil memuat sesi  -> tampilkan layar loading.
 * • Belum masuk          -> arahkan ke /admin/login.
 * • Masuk tapi role tidak diizinkan -> arahkan ke /admin (opsional: /
 *   dengan pesan, bila akses ditolak).
 */
export default function AdminGuard({ children }) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen message="Memeriksa hak akses..." />

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
        <div className="w-full max-w-md space-y-5 rounded-xl border bg-background p-6 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-lg font-bold">Akses Ditolak</h1>
            <p className="text-sm text-muted-foreground">
              Akun <span className="font-medium text-foreground">{user.email}</span> tidak memiliki
              izin untuk membuka Admin Panel. Hubungi administrator bila Anda merasa ini keliru.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button variant="outline" onClick={() => window.location.assign('/')}>
              Kembali ke Website
            </Button>
            <Button asChild>
              <Link to="/admin/login">Ganti Akun</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return children
}