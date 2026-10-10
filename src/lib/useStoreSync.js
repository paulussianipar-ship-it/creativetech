import { useEffect, useRef } from 'react'

/**
 * Hook untuk mendengarkan perubahan data dari Admin Panel.
 *
 * Setiap kali admin menyimpan konten atau proyek, store lokal memancarkan
 * event 'pdits:store:updated'. Hook ini memanggil `refetch` secara
 * otomatis sehingga halaman publik langsung ter-update tanpa reload.
 *
 * `refetch` selalu dipanggil dalam versi terbarunya, sehingga aman untuk
 * fungsi yang berubah (mis. bergantung pada parameter rute).
 *
 * @param {Function} refetch - fungsi async yang mengambil ulang data
 */
export function useStoreSync(refetch) {
  const ref = useRef(refetch)

  useEffect(() => {
    ref.current = refetch
  }, [refetch])

  useEffect(() => {
    const handler = () => ref.current?.()
    window.addEventListener('pdits:store:updated', handler)
    return () => window.removeEventListener('pdits:store:updated', handler)
  }, [])
}
