import { DatabaseZap } from 'lucide-react'
import { Alert } from '@/components/ui/alert'

/**
 * Peringatan yang muncul saat Supabase belum terkonfigurasi.
 * Seluruh Admin Panel tetap berfungsi dalam mode demo (data lokal).
 */
export default function DemoModeBanner() {
  return (
    <Alert
      variant="warning"
      icon={DatabaseZap}
      title="Mode Demo — Supabase belum terhubung"
      description="Masih memakai data contoh lokal. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY pada file .env lalu jalankan kembali untuk menyimpan data sungguhan ke database."
    />
  )
}