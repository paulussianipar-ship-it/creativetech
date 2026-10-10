import { useCallback, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  Mail,
  FileText,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROLE_LABELS } from '@/lib/constants'
import { fetchUnreadMessageCount } from '@/lib/api'
import { useStoreSync } from '@/lib/useStoreSync'

/** Definisi menu Admin Panel. */
export const ADMIN_NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Ringkasan', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Project', icon: FolderKanban },
  { to: '/admin/content', label: 'Konten Website', icon: FileText },
  { to: '/admin/messages', label: 'Pesan Masuk', icon: Mail, badge: 'messages' },
  { to: '/admin/users', label: 'Pengguna', icon: ShieldCheck, adminOnly: true },
  { to: '/admin/settings', label: 'Pengaturan', icon: Settings },
  { to: '/admin/audit-log', label: 'Log Aktivitas', icon: ScrollText },
]

/**
 * Sidebar Admin Panel.
 * `onNavigate` dipakai untuk menutup sidebar otomatis di layar kecil.
 */
export default function AppSidebar({ user, role, onNavigate }) {
  const visibleItems = ADMIN_NAV_ITEMS.filter((item) => !item.adminOnly || role === 'admin')
  const [unread, setUnread] = useState(0)

  const loadUnread = useCallback(async () => {
    const { data } = await fetchUnreadMessageCount()
    setUnread(typeof data === 'number' ? data : 0)
  }, [])

  useEffect(() => {
    loadUnread()
  }, [loadUnread])
  useStoreSync(loadUnread)

  return (
    <div className="flex h-full flex-col border-r bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight">Paul Design</p>
          <p className="truncate text-[11px] leading-tight text-muted-foreground">&amp; IT Solution</p>
        </div>
      </div>

      {/* Navigasi */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-sidebar-foreground/80 hover:bg-accent hover:text-accent-foreground',
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
            {item.badge === 'messages' && unread > 0 && (
              <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                {unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 space-y-3 border-t p-3">
        <div className="rounded-lg bg-muted/60 p-3">
          <p className="text-xs font-semibold">{user?.name || 'Administrator'}</p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{user?.email}</p>
          <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
            {ROLE_LABELS[role] || 'Pengguna'}
          </span>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Lihat Website
        </a>
      </div>
    </div>
  )
}