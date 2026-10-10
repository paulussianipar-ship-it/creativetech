import { useEffect, useState } from 'react'
import { useLang } from '../../contexts/LangContext'
import { useAuth } from '../../contexts/AuthContext'
import { fetchProfiles, updateProfile, deleteProfile } from '../../lib/api'
import { formatDate } from '../../lib/utils'
import { toast } from 'sonner'
import { Trash2, ShieldCheck, ShieldAlert } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function AdminUsers() {
  const { t, lang } = useLang()
  const { profile: me, isAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      setUsers(await fetchProfiles())
    } catch {
      toast.error('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleRoleChange(user, role) {
    if (!isAdmin) return toast.error('Only admins can change roles.')
    if (user.id === me?.id) return toast.error('You cannot change your own role.')
    try {
      await updateProfile(user.id, { role })
      toast.success('Role updated.')
      load()
    } catch {
      toast.error('Failed to update role.')
    }
  }

  async function handleDelete(user) {
    if (!isAdmin) return toast.error('Only admins can delete users.')
    if (user.id === me?.id) return toast.error('You cannot delete yourself.')
    if (!window.confirm(t.admin.confirm_delete)) return
    try {
      await deleteProfile(user.id)
      toast.success('User deleted.')
      load()
    } catch {
      toast.error('Failed to delete user.')
    }
  }

  const roleColors = {
    admin: 'text-red-500 bg-red-500/10',
    editor: 'text-blue-500 bg-blue-500/10',
    user: 'text-muted-foreground bg-muted',
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold mb-6">{t.admin.users}</h1>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-muted rounded animate-pulse" />)}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">User</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground hidden sm:table-cell">Role</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">Joined</th>
                <th className="px-6 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{u.name || '-'}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold capitalize', roleColors[u.role] || 'bg-muted')}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold capitalize',
                      u.status === 'active' ? 'text-success bg-success/10' : 'text-muted-foreground bg-muted'
                    )}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-xs text-muted-foreground">
                    {formatDate(u.created_at, lang === 'en' ? 'en-US' : 'id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {isAdmin && u.id !== me?.id && (
                        <>
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleRoleChange(u, 'admin')}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                              title="Make Admin"
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                          )}
                          {u.role !== 'editor' && (
                            <button
                              onClick={() => handleRoleChange(u, 'editor')}
                              className="p-1.5 rounded-lg hover:bg-blue-500/10 text-muted-foreground hover:text-blue-500 transition-colors"
                              title="Make Editor"
                            >
                              <ShieldAlert className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(u)}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            title={t.admin.delete}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {u.id === me?.id && <span className="text-xs text-muted-foreground">You</span>}
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
