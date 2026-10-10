import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../contexts/LangContext'
import { fetchAllProjects, fetchContactMessages, fetchProfiles } from '../../lib/api'
import { FolderOpen, MessageSquare, Users, TrendingUp, Plus } from 'lucide-react'

export default function AdminDashboard() {
  const { t } = useLang()
  const [stats, setStats] = useState({ projects: 0, published: 0, messages: 0, unread: 0, users: 0 })

  useEffect(() => {
    Promise.allSettled([
      fetchAllProjects(),
      fetchContactMessages(),
      fetchProfiles(),
    ]).then(([p, m, u]) => {
      const projects = p.status === 'fulfilled' ? p.value : []
      const messages = m.status === 'fulfilled' ? m.value : []
      const users = u.status === 'fulfilled' ? u.value : []
      setStats({
        projects: projects.length,
        published: projects.filter(x => x.status === 'published').length,
        messages: messages.length,
        unread: messages.filter(x => !x.read).length,
        users: users.length,
      })
    })
  }, [])

  const cards = [
    { icon: FolderOpen, label: t.admin.projects, value: stats.projects, sub: `${stats.published} published`, to: '/admin/projects', color: 'text-violet-500 bg-violet-500/10' },
    { icon: MessageSquare, label: t.admin.messages, value: stats.messages, sub: `${stats.unread} unread`, to: '/admin/messages', color: 'text-blue-500 bg-blue-500/10' },
    { icon: Users, label: t.admin.users, value: stats.users, sub: 'registered users', to: '/admin/users', color: 'text-emerald-500 bg-emerald-500/10' },
    { icon: TrendingUp, label: 'Published', value: stats.published, sub: 'live projects', to: '/admin/projects', color: 'text-amber-500 bg-amber-500/10' },
  ]

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{t.admin.dashboard}</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back!</p>
        </div>
        <Link
          to="/admin/projects/new"
          id="btn-new-project"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          {t.admin.new}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(({ icon: Icon, label, value, sub, to, color }) => (
          <Link
            key={label}
            to={to}
            className="p-5 rounded-2xl bg-card border border-border card-hover block"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold mb-0.5">{value}</div>
            <div className="text-sm font-medium">{label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-semibold mb-4 text-sm">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: t.admin.new, to: '/admin/projects/new' },
            { label: t.admin.content, to: '/admin/content' },
            { label: t.admin.settings, to: '/admin/settings' },
            { label: t.admin.messages, to: '/admin/messages' },
            { label: t.admin.users, to: '/admin/users' },
            { label: t.admin.audit, to: '/admin/audit' },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="px-4 py-3 rounded-xl bg-muted hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium text-center"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
