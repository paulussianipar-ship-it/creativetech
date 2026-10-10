/**
 * Data contoh (mode demo).
 * Dipakai ketika variabel lingkungan Supabase belum diisi,
 * sehingga Admin Panel tetap bisa dijalankan & diuji.
 */

const now = Date.now()
const daysAgo = (n) => new Date(now - n * 24 * 60 * 60 * 1000).toISOString()

export const DEMO_USERS = [
  {
    id: 'u-1',
    name: 'Paulus Petrus P Sianipar',
    email: 'admin@pauldesign.co.id',
    role: 'admin',
    status: 'active',
    avatar_url: null,
    phone: '+62 85162744708',
    created_at: daysAgo(420),
  },
  {
    id: 'u-2',
    name: 'Editor Website',
    email: 'editor@pauldesign.co.id',
    role: 'editor',
    status: 'active',
    avatar_url: null,
    phone: null,
    created_at: daysAgo(240),
  },
]

export const DEMO_PROJECTS = [
  {
    id: 'p-1',
    title: 'Creative Design',
    slug: 'project-creative-design',
    category: 'design',
    status: 'published',
    description:
      'Desain identitas visual, branding, dan materi promosi yang konsisten untuk membangun citra merek yang kuat dan mudah diingat.',
    content:
      '<p>Layanan Creative Design mencakup pembuatan logo, brand guideline, desain cetak (brosur, poster, kartu nama, banner), konten digital &amp; sosial media, company profile, merchandise, hingga ilustrasi vektor berkualitas tinggi.</p><p>Tools: Adobe Illustrator, Photoshop, InDesign, Canva, CorelDRAW, dan Figma.</p>',
    image_url: null,
    images: [],
    client: null,
    featured: true,
    created_at: daysAgo(180),
    updated_at: daysAgo(6),
  },
  {
    id: 'p-2',
    title: 'Multimedia',
    slug: 'project-multimedia',
    category: 'media',
    status: 'published',
    description:
      'Produksi konten multimedia interaktif: photoshoot, videoshoot, video promosi, motion graphic, animasi 3D, serta konten sosial media.',
    content:
      '<p>Layanan Multimedia meliputi photoshoot &amp; videoshoot produk, editing foto dan video, pembuatan video profil, motion graphic, hingga animasi 3D untuk kebutuhan promosi maupun dokumentasi.</p><p>Tools: Adobe Premiere Pro, After Effects, DaVinci Resolve, dan Blender.</p>',
    image_url: null,
    images: [],
    client: null,
    featured: true,
    created_at: daysAgo(150),
    updated_at: daysAgo(21),
  },
  {
    id: 'p-3',
    title: 'IT Consultant',
    slug: 'project-it-consultant',
    category: 'it',
    status: 'published',
    description:
      'Konsultasi teknologi menyeluruh mulai dari audit infrastruktur, perancangan arsitektur, perawatan, instalasi, hingga perbaikan.',
    content:
      '<p>Layanan IT Consultant mencakup audit infrastruktur &amp; jaringan, perancangan arsitektur sistem, networking, instalasi perangkat, maintenance berkala, serta perbaikan (repair) perangkat keras dan lunak.</p><p>Keahlian: Networking, Maintenance, Installation, dan Repair.</p>',
    image_url: null,
    images: [],
    client: null,
    featured: false,
    created_at: daysAgo(120),
    updated_at: daysAgo(40),
  },
  {
    id: 'p-4',
    title: 'Web Development',
    slug: 'project-web-development',
    category: 'web',
    status: 'published',
    description:
      'Pengembangan website dan aplikasi web responsif yang cepat, aman, serta SEO-friendly.',
    content:
      '<p>Layanan Web Development meliputi pembuatan website company profile, katalog, e-commerce, hingga aplikasi web custom yang responsif dan SEO-friendly, lengkap dengan pengelolaan domain dan hosting.</p><p>Stack: JavaScript, PHP, Laravel, dan MySQL.</p>',
    image_url: null,
    images: [],
    client: null,
    featured: false,
    created_at: daysAgo(60),
    updated_at: daysAgo(2),
  },
  {
    id: 'p-5',
    title: 'CCTV Specialist',
    slug: 'project-cctv-specialist',
    category: 'security',
    status: 'published',
    description:
      'Instalasi dan konfigurasi sistem CCTV untuk keamanan rumah, ruko, maupun kantor.',
    content:
      '<p>Layanan CCTV Specialist mencakup survei lokasi, instalasi kamera IP &amp; analog, konfigurasi NVR, pengaturan remote viewing, dan perawatan sistem keamanan untuk rumah, ruko, gudang, maupun kantor.</p><p>Keahlian: IP Camera, NVR Setup, CCTV Remote Viewing, dan Network Cabling.</p>',
    image_url: null,
    images: [],
    client: null,
    featured: false,
    created_at: daysAgo(300),
    updated_at: daysAgo(75),
  },
]

export const DEMO_CONTENT = {
  home: {
    heroTitle: 'Membangun Solusi Digital Eksklusif & Skalabel',
    heroSubtitle:
      'Menggabungkan keahlian mendalam pada pengembangan Creative Design & Full-Stack Web, arsitektur cloud performa tinggi, serta estetika UI/UX modern untuk menciptakan pengalaman digital terbaik.',
    heroButton: 'Lihat Portofolio Proyek',
    aboutTeaser:
      '<p>Jelajahi halaman lengkap kami untuk melihat profil, proyek terbaru, serta informasi kontak dan lokasi studio.</p>',
  },
  about: {
    title: 'Tentang Saya',
    description:
      '<p>Saya memfokuskan karir profesional saya untuk membantu perusahaan dan pemangku kepentingan membangun produk digital berskala industri. Berbekal pemahaman arsitektur perangkat lunak yang matang serta dorongan estetika visual, saya percaya setiap karya desain dan baris kode harus berdampak langsung pada kecepatan, kenyamanan, dan kepuasan pengguna.</p>',
    vision: 'Menjadi profesional kreatif & teknologi yang dipercaya dalam menghadirkan solusi digital berdampak.',
    mission: 'Menghadirkan karya desain dan sistem yang andal, inovatif, serta tepat waktu bagi setiap klien.',
  },
  contact: {
    email: 'paulussianipar@gmail.com',
    phone: '+62 85162744708',
    whatsapp: '+62 85162744708',
    address: 'Bekasi, Jawa Barat, Indonesia',
    mapUrl:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15863.599745942689!2d106.9366402!3d-6.2768852!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698d125bf98c8d%3A0x97a7268772a6e067!2sClarista%20Promosi!5e0!3m2!1sen!2sid!4v1790405655792!5m2!1sen!2sid',
  },
  services: {
    intro:
      '<p>Kami menyediakan layanan Creative Design, Multimedia, IT Consultant, Web Development, dan pemasangan CCTV.</p>',
  },
}

export const DEMO_SETTINGS = {
  siteName: 'Paul Design & IT Solution',
  tagline:
    'Creative Designer & IT Specialist. Menyediakan layanan pembuatan website, UI/UX, desain grafis, editing multimedia, dan solusi IT terpadu.',
  contactEmail: 'paulussianipar@gmail.com',
  defaultLanguage: 'id',
  maintenanceMode: false,
  allowRegistration: false,
  itemsPerPage: 10,
}

export const DEMO_CONTACT_MESSAGES = [
  {
    id: 'c-1',
    name: 'Dewi Anggraini',
    email: 'dewi@tokobunga.id',
    topic: 'Pengembangan Web / App',
    message:
      'Selamat siang, saya ingin membuat website katalog untuk toko bunga. Mohon info estimasi biaya dan waktu pengerjaan. Terima kasih.',
    read: false,
    created_at: daysAgo(0.1),
  },
  {
    id: 'c-2',
    name: 'Hendra Wijaya',
    email: 'hendra@logistiknusantara.co.id',
    topic: 'Konsultasi IT & Arsitektur',
    message:
      'Kami butuh audit jaringan untuk 3 gudang dan rencana pemasangan CCTV. Apakah bisa dijadwalkan survei lokasi minggu depan?',
    read: false,
    created_at: daysAgo(1.3),
  },
  {
    id: 'c-3',
    name: 'Sari Melati',
    email: 'sari.melati@gmail.com',
    topic: 'Desain Kreatif & UI/UX',
    message:
      'Halo, saya butuh rebranding logo dan feed Instagram untuk brand skincare baru. Boleh minta portofolio desain?',
    read: true,
    created_at: daysAgo(4),
  },
  {
    id: 'c-4',
    name: 'Agus Salim',
    email: 'agus@sman5.sch.id',
    topic: 'Kerja Sama / Hiring',
    message:
      'Kami ingin mengundang untuk mengisi workshop multimedia bagi siswa. Apakah tersedia jadwal bulan depan?',
    read: true,
    created_at: daysAgo(9),
  },
]

export const DEMO_AUDIT_LOGS = [
  {
    id: 'a-1',
    actor: 'Paulus Petrus P Sianipar',
    action: 'update',
    entity: 'project',
    entity_id: 'p-1',
    description: 'Memperbarui project "Creative Design"',
    created_at: daysAgo(0.02),
  },
  {
    id: 'a-2',
    actor: 'Editor Website',
    action: 'update',
    entity: 'content',
    entity_id: 'home',
    description: 'Memperbarui konten section "Beranda"',
    created_at: daysAgo(1),
  },
  {
    id: 'a-3',
    actor: 'Paulus Petrus P Sianipar',
    action: 'create',
    entity: 'project',
    entity_id: 'p-2',
    description: 'Menambah project "Multimedia"',
    created_at: daysAgo(12),
  },
  {
    id: 'a-4',
    actor: 'Editor Website',
    action: 'upload',
    entity: 'project',
    entity_id: 'p-3',
    description: 'Mengunggah 3 gambar pada "IT Consultant"',
    created_at: daysAgo(18),
  },
  {
    id: 'a-5',
    actor: 'Paulus Petrus P Sianipar',
    action: 'delete',
    entity: 'project',
    entity_id: 'p-6',
    description: 'Menghapus project "Company Profile 2024"',
    created_at: daysAgo(33),
  },
  {
    id: 'a-6',
    actor: 'Paulus Petrus P Sianipar',
    action: 'login',
    entity: 'auth',
    entity_id: null,
    description: 'Masuk ke panel admin',
    created_at: daysAgo(34),
  },
  {
    id: 'a-7',
    actor: 'Paulus Petrus P Sianipar',
    action: 'update',
    entity: 'settings',
    entity_id: null,
    description: 'Memperbarui pengaturan website',
    created_at: daysAgo(41),
  },
  {
    id: 'a-8',
    actor: 'Editor Website',
    action: 'login',
    entity: 'auth',
    entity_id: null,
    description: 'Masuk ke panel admin',
    created_at: daysAgo(55),
  },
]