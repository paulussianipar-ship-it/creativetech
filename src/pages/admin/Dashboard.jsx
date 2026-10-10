import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  FileText,
  FolderKanban,
  Layers,
  Mail,
  ShieldCheck,
  Sparkles,
  Users as UsersIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { fetchDashboardStats, fetchProjects } from '@/lib/api'
import DemoModeBanner from '@/components/admin/demo-mode-banner'
import PageHeader from '@/components/admin/page-header'
import StatCard from '@/components/admin/stat-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AUDIT_ACTIONS } from '@/lib/constants'
import { formatRelative, initials } from '@/lib/format'
import { useAuth } from '@/context/AuthContext'

export default function Dashboard() {
  const { user, role, isDemo } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentProjects, setRecentProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [statsResult, projectsResult] = await Promise.all([
          fetchDashboardStats(),
          fetchProjects({ page: 1, pageSize: 4 }),
        ])
        if (cancelled) return

        if (statsResult.error) {
          toast.error(statsResult.error)
        } else {
          setStats(statsResult.data)
        }
        if (projectsResult.error) {
          toast.error(projectsResult.error)
        } else {
          setRecentProjects(projectsResult.data || [])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const firstName = String(user?.name || '').split(' ')[0] || 'Admin'

  return (
    <div className="space-y-6">
      {isDemo && <DemoModeBanner />}

      <PageHeader
        title={`Selamat datang, ${firstName}!`}
        description="Kelola pengguna, project, dan konten website dari sini."
      >
        <Button asChild>
          <Link to="/admin/projects">
            <FolderKanban />
            Project Baru
          </Link>
        </Button>
      </PageHeader>

      {/* Kartu statistik */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Pengguna"
          value={stats?.users?.total}
          icon={UsersIcon}
          loading={loading}
          hint={`${stats?.users?.active ?? 0} aktif`}
        />
        <StatCard
          title="Total Project"
          value={stats?.projects?.total}
          icon={FolderKanban}
          loading={loading}
          hint={`${stats?.projects?.published ?? 0} terbit`}
        />
        <StatCard
          title="Pesan Masuk"
          value={stats?.messages?.total}
          icon={Mail}
          loading={loading}
          hint={`${stats?.messages?.unread ?? 0} belum dibaca`}
        />
        <StatCard
          title="Peran Aktif"
          value={stats?.users?.admin + stats?.users?.editor || 0}
          icon={ShieldCheck}
          loading={loading}
          hint="admin & editor"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Project terbaru */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Project Terbaru</CardTitle>
            <CardDescription>Empat project yang terakhir diperbarui.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2, 3].map((item) => (
                  <Skeleton key={item} className="h-12 w-full" />
                ))}
              </div>
            ) : recentProjects.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Belum ada project.
              </p>
            ) : (
              recentProjects.map((project) => (
                <Link
                  key={project.id}
                  to="/admin/projects"
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{project.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {project.category} · diperbarui {formatRelative(project.updated_at)}
                    </p>
                  </div>
                  <Badge variant="muted">{project.status}</Badge>
                </Link>
              ))
            )}
            <div className="pt-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/projects">
                  Lihat semua project
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Aktivitas terbaru */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Log aktivitas 5 terakhir.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2, 3, 4].map((item) => (
                  <Skeleton key={item} className="h-10 w-full" />
                ))}
              </div>
            ) : !stats?.recentActivity?.length ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Belum ada aktivitas.</p>
            ) : (
              stats.recentActivity.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-[10px]">{initials(log.actor)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-[13px] leading-snug">
                      <span className="font-semibold">{log.actor}</span>{' '}
                      <span className="text-muted-foreground">
                        {AUDIT_ACTIONS[log.action] || log.action}
                      </span>{' '}
                      {log.entity !== 'auth' && (
                        <span className="font-medium text-muted-foreground">{log.entity}</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatRelative(log.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Aksi cepat */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Aksi Cepat
          </CardTitle>
          <CardDescription>Tujuan umum untuk mengelola website.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { to: '/admin/projects', label: 'Tambah Project', icon: FolderKanban },
              { to: '/admin/content', label: 'Edit Konten Beranda', icon: FileText },
              ...(role === 'admin'
                ? [{ to: '/admin/users', label: 'Tambah Pengguna', icon: UsersIcon }]
                : []),
              { to: '/admin/settings', label: 'Pengaturan Sistem', icon: BadgeCheck },
            ].map((action) => (
              <Button key={action.label} asChild variant="outline" className="justify-between">
                <Link to={action.to}>
                  {action.label}
                  <action.icon className="text-muted-foreground" />
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}