import { useEffect, useState } from 'react'
import { useLang } from '../../contexts/LangContext'
import { fetchAuditLogs } from '../../lib/api'
import { formatDate } from '../../lib/utils'
import { toast } from 'sonner'
import { cn } from '../../lib/utils'

const ACTION_COLORS = {
  create: 'text-success bg-success/10',
  update: 'text-blue-500 bg-blue-500/10',
  delete: 'text-destructive bg-destructive/10',
  upload: 'text-violet-500 bg-violet-500/10',
  login: 'text-muted-foreground bg-muted',
  logout: 'text-muted-foreground bg-muted',
}

export default function AdminAuditLog() {
  const { t, lang } = useLang()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAuditLogs(200)
      .then(setLogs)
      .catch(() => toast.error('Failed to load audit logs.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold mb-6">{t.admin.audit}</h1>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-2">{[...Array(8)].map((_, i) => <div key={i} className="h-8 bg-muted rounded animate-pulse" />)}</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">No audit logs yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Action</th>
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Entity</th>
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Actor</th>
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">Description</th>
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold capitalize', ACTION_COLORS[log.action] || 'bg-muted')}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 capitalize">{log.entity}</td>
                    <td className="px-5 py-3 text-muted-foreground text-xs hidden md:table-cell">{log.actor_email || '-'}</td>
                    <td className="px-5 py-3 text-muted-foreground text-xs hidden lg:table-cell max-w-xs truncate">{log.description || '-'}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(log.created_at, lang === 'en' ? 'en-US' : 'id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
