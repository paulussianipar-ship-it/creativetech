import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLang } from '../../contexts/LangContext'
import { useTheme } from '../../contexts/ThemeContext'
import { toast } from 'sonner'
import { cn } from '../../lib/utils'
import {
  LayoutDashboard, FolderOpen, FileText, Users, MessageSquare,
  Settings, ClipboardList, LogOut, Sun, Moon, ChevronLeft, Menu, Globe
} from 'lucide-react'

export default function AdminLayout() {
  const { profile, signOut } = useAuth()
  const { t, lang, toggle: toggleLang } = useLang()
  const { dark, toggle: toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  async function handleLogout() {
    await signOut()
    toast.success(t.auth.logout)
    navigate('/admin/login')
  }

  const links = [
    { to: '/admin', end: true, icon: LayoutDashboard, label: t.admin.dashboard },
    { to: '/admin/projects', icon: FolderOpen, label: t.admin.projects },
    { to: '/admin/content', icon: FileText, label: t.admin.content },
    { to: '/admin/users', icon: Users, label: t.admin.users },
    { to: '/admin/messages', icon: MessageSquare, label: t.admin.messages },
    { to: '/admin/settings', icon: Settings, label: t.admin.settings },
    { to: '/admin/audit', icon: ClipboardList, label: t.admin.audit },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 shrink-0',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border">
          {!collapsed && (
            <span className="font-bold text-sm gradient-text">CreativeTech</span>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors ml-auto"
            id="btn-sidebar-collapse"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {links.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  collapsed ? 'justify-center' : '',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )
              }
              title={collapsed ? label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-sidebar-border p-3 space-y-1">
          {!collapsed && profile && (
            <div className="px-2 py-1 mb-2">
              <p className="text-xs font-semibold truncate text-sidebar-foreground">{profile.name || profile.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
            </div>
          )}
          <button
            onClick={toggleLang}
            className={cn(
              'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium hover:bg-sidebar-accent transition-colors text-sidebar-foreground',
              collapsed ? 'justify-center' : ''
            )}
            id="btn-admin-lang"
          >
            <Globe className="w-4 h-4 shrink-0" />
            {!collapsed && lang.toUpperCase()}
          </button>
          <button
            onClick={toggleTheme}
            className={cn(
              'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium hover:bg-sidebar-accent transition-colors text-sidebar-foreground',
              collapsed ? 'justify-center' : ''
            )}
            id="btn-admin-theme"
          >
            {dark ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            {!collapsed && (dark ? 'Light' : 'Dark')}
          </button>
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium hover:bg-destructive/10 hover:text-destructive transition-colors text-sidebar-foreground',
              collapsed ? 'justify-center' : ''
            )}
            id="btn-admin-logout"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && t.admin.logout}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
