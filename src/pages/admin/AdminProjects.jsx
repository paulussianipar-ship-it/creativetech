import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../contexts/LangContext'
import { fetchAllProjects, deleteProject } from '../../lib/api'
import { formatDate } from '../../lib/utils'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../lib/utils'

export default function AdminProjects() {
  const { t, lang } = useLang()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const data = await fetchAllProjects()
      setProjects(data)
    } catch {
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(project) {
    if (!window.confirm(t.admin.confirm_delete)) return
    try {
      await deleteProject(project.id)
      toast.success('Project deleted.')
      load()
    } catch {
      toast.error('Failed to delete project.')
    }
  }

  const statusColor = {
    published: 'text-success bg-success/10',
    draft: 'text-warning bg-warning/10',
    archived: 'text-muted-foreground bg-muted',
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{t.admin.projects}</h1>
        <Link
          to="/admin/projects/new"
          id="btn-projects-new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          {t.admin.new}
        </Link>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            No projects yet. <Link to="/admin/projects/new" className="text-primary hover:underline">Create one →</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Title</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground hidden sm:table-cell">Category</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">Date</th>
                <th className="px-6 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    {p.title}
                    {p.featured && <span className="ml-2 text-xs text-amber-500">★</span>}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">{p.category}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold capitalize', statusColor[p.status] || 'bg-muted')}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden lg:table-cell text-xs">
                    {formatDate(p.created_at, lang === 'en' ? 'en-US' : 'id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/portfolio/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <Link
                        to={`/admin/projects/${p.id}/edit`}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title={t.admin.edit}
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        title={t.admin.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
