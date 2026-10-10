import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ADMIN_ROLES } from '@/lib/constants'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

/**
 * AuthContext — sesi admin berbasis Supabase Auth.
 *
 * • Mode terhubung  : session + profil diambil dari Supabase.
 * • Mode demo       : bila VITE_SUPABASE_URL / ANON_KEY belum diisi,
 *                     sesi dicatat di localStorage agar panel tetap
 *                     bisa dijalankan tanpa kredensial.
 *
 * Peran pengguna dibaca dari tabel `profiles` (kolom `role`):
 * 'admin' | 'editor' | 'user'. Hanya admin & editor yang boleh
 * mengakses /admin/*.
 */

const AuthContext = createContext(null)

const DEMO_SESSION_KEY = 'pdits.demo.session'

/** Akun demo yang bisa dipakai saat Supabase belum terhubung. */
export const DEMO_ACCOUNTS = [
  { email: 'admin@pauldesign.co.id', password: 'admin123', role: 'admin', name: 'Paulus Petrus P Sianipar' },
  { email: 'editor@pauldesign.co.id', password: 'editor123', role: 'editor', name: 'Editor Website' },
]

function roleFromDemoEmail(email) {
  const value = String(email || '').toLowerCase()
  if (value.includes('admin')) return 'admin'
  if (value.includes('editor')) return 'editor'
  return 'user'
}

function readDemoSession() {
  try {
    const raw = window.localStorage.getItem(DEMO_SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeDemoSession(session) {
  try {
    if (session) window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session))
    else window.localStorage.removeItem(DEMO_SESSION_KEY)
  } catch {
    /* abaikan */
  }
}

/** Ambil profil dari tabel `profiles`; buat otomatis bila belum ada. */
async function loadProfile(user) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role, status, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.warn('Gagal membaca profil:', error.message)
    return {
      id: user.id,
      name: user.user_metadata?.full_name || user.email,
      email: user.email,
      role: 'user',
      avatar_url: null,
    }
  }

  if (data) return data

  // Profil belum ada (mis. pengguna dibuat langsung dari Supabase Auth).
  const fallbackName = user.user_metadata?.full_name || String(user.email || '').split('@')[0]
  const { data: created } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      name: fallbackName,
      email: user.email,
      role: 'user',
      status: 'active',
    })
    .select()
    .single()

  return (
    created || {
      id: user.id,
      name: fallbackName,
      email: user.email,
      role: 'user',
      avatar_url: null,
    }
  )
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  /* Pemulihan sesi awal */
  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!isSupabaseConfigured) {
        if (cancelled) return
        setSession(readDemoSession())
        setLoading(false)
        return
      }

      const { data } = await supabase.auth.getSession()
      const current = data?.session ?? null

      if (!cancelled) setSession(current)

      if (current?.user && !cancelled) {
        setProfile(await loadProfile(current.user))
      }
      if (!cancelled) setLoading(false)
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  /* Sinkronkan perubahan sesi Supabase */
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession)
      if (nextSession?.user) {
        const nextProfile = await loadProfile(nextSession.user)
        setProfile(nextProfile)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email, password) => {
    const cleanEmail = String(email || '').trim().toLowerCase()

    if (!cleanEmail || !password) {
      return { success: false, error: 'Email dan password wajib diisi.' }
    }

    if (!isSupabaseConfigured) {
      // Demo: kredensial apa pun minimal 6 karakter diterima.
      if (String(password).length < 6) {
        return { success: false, error: 'Password minimal 6 karakter.' }
      }
      const demoSession = {
        email: cleanEmail,
        name:
          DEMO_ACCOUNTS.find((account) => account.email === cleanEmail)?.name ||
          cleanEmail.split('@')[0],
        role: roleFromDemoEmail(cleanEmail),
        isDemo: true,
        loggedInAt: new Date().toISOString(),
      }
      writeDemoSession(demoSession)
      setSession(demoSession)
      setProfile({
        id: `demo-${cleanEmail}`,
        name: demoSession.name,
        email: demoSession.email,
        role: demoSession.role,
        avatar_url: null,
      })
      return { success: true }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })

    if (error) {
      const message =
        error.message === 'Invalid login credentials'
          ? 'Email atau password salah.'
          : error.message
      return { success: false, error: message }
    }

    if (!data.user) return { success: false, error: 'Gagal masuk. Silakan coba lagi.' }

    const nextProfile = await loadProfile(data.user)
    setProfile(nextProfile)

    if (nextProfile.status === 'inactive') {
      await supabase.auth.signOut()
      return { success: false, error: 'Akun Anda berstatus nonaktif. Hubungi administrator.' }
    }

    return { success: true }
  }, [])

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut()
      if (error) console.warn('Gagal keluar:', error.message)
    } else {
      writeDemoSession(null)
    }
    setSession(null)
    setProfile(null)
  }, [])

  const value = useMemo(() => {
    const role = profile?.role || session?.role || null
    const user = session
      ? {
          id: profile?.id || session.email,
          email: profile?.email || session.email,
          name: profile?.name || session.name || session.email,
          role,
          avatar_url: profile?.avatar_url || null,
        }
      : null

    return {
      user,
      profile,
      session,
      role,
      isAdmin: ADMIN_ROLES.includes(role),
      loading,
      isDemo: !isSupabaseConfigured,
      signIn,
      signOut,
    }
  }, [session, profile, loading, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth harus dipakai di dalam <AuthProvider>.')
  return context
}