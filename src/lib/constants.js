/** Label peran dalam Bahasa Indonesia. */
export const ROLE_LABELS = {
  admin: 'Admin',
  editor: 'Editor',
  user: 'Pengguna',
}

/** Semua peran yang boleh mengakses panel admin. */
export const ADMIN_ROLES = ['admin', 'editor']

export const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'user', label: 'Pengguna' },
]

/** Label status project dalam Bahasa Indonesia. */
export const PROJECT_STATUS_LABELS = {
  published: 'Terbit',
  draft: 'Draf',
  archived: 'Arsip',
}

export const PROJECT_STATUS_OPTIONS = [
  { value: 'published', label: 'Terbit' },
  { value: 'draft', label: 'Draf' },
  { value: 'archived', label: 'Arsip' },
]

export const CATEGORY_OPTIONS = [
  { value: 'design', label: 'Design' },
  { value: 'media', label: 'Media' },
  { value: 'it', label: 'IT Solution' },
  { value: 'web', label: 'Web Development' },
  { value: 'security', label: 'Security / CCTV' },
  { value: 'other', label: 'Lainnya' },
]

/** Kunci konten per section beserta label field-nya. */
export const CONTENT_FIELDS = {
  home: [
    { key: 'heroTitle', label: 'Judul Hero', type: 'input' },
    { key: 'heroSubtitle', label: 'Subjudul Hero', type: 'textarea', rich: false },
    { key: 'heroButton', label: 'Teks Tombol Hero', type: 'input' },
    { key: 'aboutTeaser', label: 'Cuplikan Tentang Kami', type: 'textarea', rich: true },
  ],
  about: [
    { key: 'title', label: 'Judul Halaman', type: 'input' },
    { key: 'description', label: 'Deskripsi', type: 'textarea', rich: true },
    { key: 'vision', label: 'Visi', type: 'textarea', rich: false },
    { key: 'mission', label: 'Misi', type: 'textarea', rich: false },
  ],
  contact: [
    { key: 'email', label: 'Email', type: 'input' },
    { key: 'phone', label: 'Nomor Telepon', type: 'input' },
    { key: 'whatsapp', label: 'WhatsApp', type: 'input' },
    { key: 'address', label: 'Alamat', type: 'textarea', rich: false },
    { key: 'mapUrl', label: 'URL Peta (Google Maps)', type: 'input' },
  ],
  services: [
    { key: 'intro', label: 'Paragraf Pembuka', type: 'textarea', rich: true },
  ],
}

export const CONTENT_SECTIONS = [
  { key: 'home', label: 'Beranda' },
  { key: 'about', label: 'Tentang Kami' },
  { key: 'contact', label: 'Kontak' },
  { key: 'services', label: 'Layanan' },
]

/** Nama aksi untuk audit log. */
export const AUDIT_ACTIONS = {
  create: 'Menambah',
  update: 'Memperbarui',
  delete: 'Menghapus',
  login: 'Masuk',
  logout: 'Keluar',
  upload: 'Mengunggah',
}

export const SETTINGS_FIELDS = [
  { key: 'siteName', label: 'Nama Website', type: 'input' },
  { key: 'tagline', label: 'Tagline', type: 'input' },
  { key: 'contactEmail', label: 'Email Kontak Utama', type: 'input' },
  { key: 'defaultLanguage', label: 'Bahasa Default', type: 'select', options: [
    { value: 'id', label: 'Bahasa Indonesia' },
    { value: 'en', label: 'English' },
  ] },
  { key: 'maintenanceMode', label: 'Mode Maintenance', type: 'switch' },
  { key: 'allowRegistration', label: 'Izinkan Pendaftaran Publik', type: 'switch' },
  { key: 'itemsPerPage', label: 'Jumlah Item per Halaman', type: 'number' },
]