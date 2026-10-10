# CreativeTech Workspace

Portal operasional untuk layanan desain dan IT, dibangun dengan React, Vite, dan Supabase.

Halaman publik: `/` (Home), `/about` (About), `/project` (Project), `/project/:slug` (detail project hasil kelola admin), dan `/contact` (Contact). Login/Register tersedia dari ikon di kanan atas; sesi yang berhasil diarahkan ke `/dashboard` dan workspace sesuai role.

Portal admin berada di `/admin` (sidebar) dengan menu Ringkasan, Project, Konten Website, Pesan Masuk, Pengguna, Pengaturan, dan Log Aktivitas. Konten/proyek yang diubah admin langsung tampil di website publik, dan pesan dari formulir kontak masuk ke menu **Pesan Masuk**.

## Jalankan lokal

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Tanpa konfigurasi Supabase, workspace berjalan dalam mode demo lokal. Pilih User, Desainer, atau Admin di halaman masuk. Data demo disimpan di browser.

## Supabase

1. Buat project Supabase, lalu jalankan `supabase/schema.sql` di SQL Editor. Skema ini juga membuat `contact_messages`; pesan publik dapat dikirim, sedangkan pembacaannya dibatasi untuk admin.
2. Isi `.env.local` dengan Project URL dan anon/publishable key:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
3. Di Supabase **Authentication → Providers → Email**, aktifkan **Confirm email**. Pada **URL Configuration**, set Site URL ke URL web dan tambahkan URL lokal serta domain produksi ke Redirect URLs. Form Register mengirim tautan konfirmasi ke email; tautan itu kembali ke `window.location.origin`.

Untuk menjalankan endpoint undangan/hapus anggota secara lokal, gunakan `vercel dev` dan tambahkan juga `SUPABASE_URL`, `SUPABASE_ANON_KEY`, serta `SUPABASE_SERVICE_ROLE_KEY`. Service-role key hanya dipakai endpoint server; jangan beri awalan `VITE_` dan jangan pernah mengirimnya ke browser.

4. Daftarkan akun melalui halaman Register. Trigger database otomatis menetapkan role `user`; metadata signup tidak dapat memilih role.
5. Tetapkan admin pertama lewat SQL Editor menggunakan email akun yang sudah terdaftar:

```sql
update public.profiles set role = 'admin' where email = 'admin@perusahaan.com';
```

Role berikutnya dapat dikelola dari menu **User Management**. Jangan gunakan service-role key di frontend.

## Deploy ke Vercel

Impor repository ke Vercel dengan framework preset **Vite**, build command `npm run build`, dan output directory `dist`. Tambahkan `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY` pada Environment Variables Vercel untuk environment yang digunakan, lalu deploy. Atur Site URL dan Redirect URLs Supabase ke domain Vercel agar tautan undangan kembali ke aplikasi.

## Akses data

`workspace_records` menyimpan permintaan, aktivitas, artikel, dan ulasan. RLS membatasi data user ke rekamannya sendiri; desainer dapat melihat workspace; admin dapat mengelola seluruh data. Perubahan role hanya dapat dilakukan melalui fungsi database admin.