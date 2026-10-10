import { Loader2 } from 'lucide-react'

/** Layar penuh untuk proses yang belum selesai (mis. cek sesi). */
export default function LoadingScreen({ message = 'Memuat data...' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}