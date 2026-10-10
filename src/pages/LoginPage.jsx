import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LangContext'
import { useTheme } from '../contexts/ThemeContext'
import { toast } from 'sonner'
import { Lock, Sun, Moon } from 'lucide-react'

export default function LoginPage() {
  const { signIn } = useAuth()
  const { t } = useLang()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(form.email, form.password)
      navigate('/admin')
    } catch {
      toast.error(t.auth.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <button
        onClick={toggle}
        className="fixed top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
        id="btn-login-theme"
      >
        {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black mx-auto mb-4">C</div>
          <h1 className="text-2xl font-extrabold gradient-text">CreativeTech</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 shadow-xl shadow-black/5 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="login-email">{t.auth.email}</label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="login-password">{t.auth.password}</label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            id="btn-login-submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:opacity-90 transition disabled:opacity-60"
          >
            <Lock className="w-4 h-4" />
            {loading ? t.auth.signing_in : t.auth.login}
          </button>
        </form>
      </div>
    </div>
  )
}
