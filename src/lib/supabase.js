import { createClient } from '@supabase/supabase-js'

const envUrl = import.meta.env?.VITE_SUPABASE_URL
const envAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY

const placeholder = 'https://placeholder.supabase.co'
const placeholderKey =
  'public-anon-key-placeholder-do-not-use-in-production'

/**
 * Status koneksi Supabase.
 * - 'connected'  : env terisi, memakai Supabase sungguhan.
 * - 'demo'       : env kosong, aplikasi berjalan dengan data lokal (mock).
 *
 * Mode demo dipakai agar admin panel tetap bisa dilihat & dicoba
 * sebelum kredensial Supabase tersedia.
 */
export const supabaseStatus = envUrl && envAnonKey ? 'connected' : 'demo'

export const isSupabaseConfigured = supabaseStatus === 'connected'

/**
 * Nama bucket Supabase Storage untuk gambar project.
 */
export const STORAGE_BUCKET = 'project-images'

export const supabase = createClient(
  envUrl || placeholder,
  envAnonKey || placeholderKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'pdits.auth.session',
    },
    global: {
      headers: { 'x-application-name': 'paul-design-it-solution' },
    },
  },
)

/**
 * Ambil pesan error Supabase yang bisa dibaca manusia (Bahasa Indonesia).
 */
export function getSupabaseError(error, fallback = 'Terjadi kesalahan. Silakan coba lagi.') {
  if (!error) return fallback
  if (error.message) return error.message
  return fallback
}