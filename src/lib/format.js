/** Format tanggal & angka dalam konvensi Indonesia. */

const DATE_LONG = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const DATE_SHORT = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const DATE_TIME = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return DATE_SHORT.format(date)
}

export function formatLongDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return DATE_LONG.format(date)
}

export function formatDateTime(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return DATE_TIME.format(date)
}

/** "3 hari lalu" */
export function formatRelative(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  const diffMs = Date.now() - date.getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes} menit lalu`

  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`

  const days = Math.round(hours / 24)
  if (days < 30) return `${days} hari lalu`

  const months = Math.round(days / 30)
  if (months < 12) return `${months} bulan lalu`

  return `${Math.round(months / 12)} tahun lalu`
}

export function formatNumber(value) {
  if (value === null || value === undefined) return '0'
  return new Intl.NumberFormat('id-ID').format(value)
}

export function formatRupiah(value) {
  if (value === null || value === undefined) return 'Rp0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

/** Ambil inisial untuk avatar. */
export function initials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Ubah teks menjadi slug URL yang aman. */
export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Potong teks panjang. */
export function truncate(text = '', length = 80) {
  const value = String(text)
  return value.length > length ? `${value.slice(0, length)}…` : value
}