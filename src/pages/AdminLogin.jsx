import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, LogIn, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { DEMO_ACCOUNTS, useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

/**
 * Halaman login Admin Panel — berdiri sendiri di luar
 * situs publik (tanpa Navbar). '/admin/login' (huruf besar)
 * dialihkan ke sini.
 */
export default function AdminLogin() {
  const { signIn, signOut, user, isAdmin, loading, isDemo } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Bila sudah login, kembali ke bagian admin.
  if (!loading && user && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)

    const result = await signIn(email, password)
    setSubmitting(false)

    if (!result.success) {
      toast.error(result.error || 'Login gagal.')
      return
    }

    // Peran non-admin diperbolehkan masuk sesi, tapi tidak punya
    // izin panel → arahkan ke beranda.
    toast.success('Selamat datang kembali!')
    const from = location.state?.from
    navigate(from || '/admin', { replace: true })
  }

  async function handleSwitchAccount() {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Pita atas minimal */}
      <header className="flex h-14 items-center justify-between border-b bg-background px-5">
        <Link
          to="/admin/login"
          className="flex items-center gap-2 text-sm font-bold"
        >
          <Sparkles className="h-5 w-5 text-primary" />
          Paul Design &amp; IT Solution
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft />
              Beranda
            </Link>
          </Button>
          {user && !isAdmin && (
            <Button variant="outline" size="sm" onClick={handleSwitchAccount}>
              Ganti Akun
            </Button>
          )}
        </div>
      </header>

      <main className="flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md space-y-4">
          {isDemo && (
            <Alert
              variant="warning"
              title="Mode Demo"
              description="Supabase belum terhubung. Gunakan akun demo di bawah untuk mencoba panel admin."
            />
          )}

          <Card className="shadow-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Lock className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Admin Panel</CardTitle>
              <CardDescription>
                Masuk untuk mengelola website Paul Design &amp; IT Solution
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@pauldesign.co.id"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <LogIn />
                      Masuk
                    </>
                  )}
                </Button>
              </form>

              {isDemo && (
                <>
                  <Separator className="my-5" />
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Akun demo (klik untuk mengisi)
                    </p>
                    {DEMO_ACCOUNTS.map((account) => (
                      <button
                        key={account.email}
                        type="button"
                        onClick={() => {
                          setEmail(account.email)
                          setPassword(account.password)
                        }}
                        className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                      >
                        <span>{account.email}</span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                          {account.role}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {user && !isAdmin && (
            <Alert
              variant="destructive"
              title="Akun tidak memiliki izin"
              description="Sesi Anda sudah aktif, tetapi peran akun bukan admin/editor sehingga tidak bisa membuka panel."
            />
          )}
        </div>
      </main>
    </div>
  )
}