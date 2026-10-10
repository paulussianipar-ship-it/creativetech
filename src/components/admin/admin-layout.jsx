import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  ExternalLink,
  LogOut,
  Menu,
  Sparkles,
  User as UserIcon,
} from 'lucide-react'
import AppSidebar from '@/components/admin/app-sidebar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ROLE_LABELS } from '@/lib/constants'
import { initials } from '@/lib/format'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

/** Judul halaman mengikuti rute aktif. */
const PAGE_META = {
  '/admin': { title: 'Ringkasan', description: 'Pantau aktivitas website dalam satu layar.' },
  '/admin/dashboard': { title: 'Ringkasan', description: 'Pantau aktivitas website dalam satu layar.' },
  '/admin/projects': { title: 'Manajemen Project', description: 'Kelola daftar project dan portofolio.' },
  '/admin/content': { title: 'Konten Website', description: 'Perbarui teks yang tampil di halaman publik.' },
  '/admin/messages': { title: 'Pesan Masuk', description: 'Pesan dari formulir kontak website.' },
  '/admin/users': { title: 'Manajemen Pengguna', description: 'Atur peran dan status akses pengguna.' },
  '/admin/settings': { title: 'Pengaturan Sistem', description: 'Konfigurasi umum website dan panel admin.' },
  '/admin/audit-log': { title: 'Log Aktivitas', description: 'Riwayat perubahan data oleh administrator.' },
}

export default function AdminLayout() {
  const { user, role, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Tutup sidebar mobile setiap pindah halaman.
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const meta = PAGE_META[location.pathname] || PAGE_META['/admin']

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <AppSidebar user={user} role={role} />
      </aside>

      {/* Sidebar mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu navigasi"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-xl">
            <AppSidebar user={user} role={role} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Konten utama */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu navigasi"
          >
            <Menu />
          </Button>

          <Link to="/admin" className="flex items-center gap-2 lg:hidden">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold">Admin Panel</span>
          </Link>

          <div className="hidden min-w-0 lg:block">
            <h1 className="truncate text-base font-bold leading-tight">{meta.title}</h1>
            <p className="truncate text-xs text-muted-foreground">{meta.description}</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <a href="/" target="_blank" rel="noreferrer">
                <ExternalLink />
                Website
              </a>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border px-2 py-1 transition-colors hover:bg-accent"
                >
                  <Avatar className="h-7 w-7">
                    {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user?.name} />}
                    <AvatarFallback className="text-[11px]">{initials(user?.name)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline">
                    {user?.name}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <span className="block truncate text-sm">{user?.name}</span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </span>
                  <span className="mt-1.5 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                    {ROLE_LABELS[role] || 'Pengguna'}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings">
                    <UserIcon />
                    Pengaturan Akun
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/" target="_blank" rel="noreferrer">
                    <ExternalLink />
                    Buka Website
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={handleSignOut}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Judul untuk layar kecil */}
        <div className="border-b bg-background px-4 py-3 sm:px-6 lg:hidden">
          <h1 className="text-sm font-bold leading-tight">{meta.title}</h1>
          <p className="text-xs text-muted-foreground">{meta.description}</p>
        </div>

        <main className={cn('p-4 sm:p-6 lg:p-8')}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}