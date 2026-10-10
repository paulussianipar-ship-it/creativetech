import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Pencil, Plus, Trash2, UserCog } from 'lucide-react'
import {
  createUserProfile,
  deleteUserProfile,
  fetchUsers,
  updateUserProfile,
} from '@/lib/api'
import { ROLE_OPTIONS } from '@/lib/constants'
import { formatDate, initials } from '@/lib/format'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/admin/page-header'
import SearchInput from '@/components/admin/search-input'
import FilterDropdown from '@/components/admin/filter-dropdown'
import RoleBadge from '@/components/admin/role-badge'
import ConfirmDialog from '@/components/admin/confirm-dialog'
import EmptyState from '@/components/admin/empty-state'
import Pagination from '@/components/admin/pagination'
import { TableSkeleton } from '@/components/admin/table-skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const EMPTY_FORM = { name: '', email: '', role: 'user', status: 'active', phone: '' }
const PAGE_SIZE = 10

const ROLE_FILTER_OPTIONS = ROLE_OPTIONS
const STATUS_FILTER_OPTIONS = [
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Nonaktif' },
]

export default function Users() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [role, setRole] = useState(null)
  const [status, setStatus] = useState(null)
  const [page, setPage] = useState(1)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null) // null = tambah baru
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [targetDelete, setTargetDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    const { data, count, error } = await fetchUsers({
      search,
      role: role || 'all',
      status: status || 'all',
      page,
      pageSize: PAGE_SIZE,
    })
    if (error) {
      toast.error(error)
    } else {
      setUsers(data || [])
      setTotal(count || 0)
      if ((data?.length || 0) === 0 && page > 1) setPage(1)
    }
    setLoading(false)
  }, [search, role, status, page])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  function openAdd() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  function openEdit(user) {
    setEditing(user)
    setForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      status: user.status || 'active',
      phone: user.phone || '',
    })
    setDialogOpen(true)
  }

  async function handleSave(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Nama dan email wajib diisi.')
      return
    }

    setSaving(true)
    const result = editing
      ? await updateUserProfile(editing.id, form)
      : await createUserProfile(form)

    setSaving(false)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success(editing ? 'Data pengguna diperbarui.' : 'Pengguna berhasil ditambahkan.')
    setDialogOpen(false)
    loadUsers()
  }

  function requestDelete(user) {
    setTargetDelete(user)
    setConfirmOpen(true)
  }

  async function handleDelete() {
    if (!targetDelete) return
    setDeleting(true)
    const { error } = await deleteUserProfile(targetDelete.id)
    setDeleting(false)
    setConfirmOpen(false)
    setTargetDelete(null)

    if (error) {
      toast.error(error)
      return
    }
    toast.success('Pengguna dihapus.')
    loadUsers()
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const isSelf = (user) => user.email === currentUser?.email

  return (
    <div className="space-y-5">
      <PageHeader
        title="Manajemen Pengguna"
        description="Kelola akun, peran, dan status akses pengguna website."
      >
        <Button onClick={openAdd}>
          <Plus />
          Tambah Pengguna
        </Button>
      </PageHeader>

      {/* Toolbar pencarian & filter */}
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          placeholder="Cari nama atau email..."
          className="w-full sm:w-72"
        />
        <div className="ml-auto flex items-center gap-2">
          <FilterDropdown
            label={role ? ROLE_FILTER_OPTIONS.find((o) => o.value === role)?.label : 'Semua Peran'}
            value={role}
            onChange={(value) => {
              setRole(value)
              setPage(1)
            }}
            options={ROLE_FILTER_OPTIONS}
          />
          <FilterDropdown
            label={status ? 'Status: ' + (status === 'active' ? 'Aktif' : 'Nonaktif') : 'Semua Status'}
            value={status}
            onChange={(value) => {
              setStatus(value)
              setPage(1)
            }}
            options={STATUS_FILTER_OPTIONS}
          />
        </div>
      </div>

      {/* Tabel */}
      {loading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : users.length === 0 ? (
        <EmptyState
          icon={UserCog}
          title="Tidak ada pengguna"
          description="Coba ubah kata kunci pencarian atau filter, atau tambahkan pengguna baru."
          action={
            <Button onClick={openAdd} size="sm">
              <Plus />
              Tambah Pengguna
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead className="hidden md:table-cell">Kontak</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Bergabung</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        {user.avatar_url && <AvatarImage src={user.avatar_url} alt={user.name} />}
                        <AvatarFallback>{initials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {user.name}
                          {isSelf(user) && (
                            <span className="ml-1.5 text-xs text-muted-foreground">(Anda)</span>
                          )}
                        </p>
                        <p className="truncate text-xs text-muted-foreground md:hidden">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="text-sm">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.phone || '—'}</p>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'success' : 'muted'}>
                      {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(user)}
                        title="Edit pengguna"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => requestDelete(user)}
                        disabled={isSelf(user)}
                        title={isSelf(user) ? 'Tidak bisa menghapus akun sendiri' : 'Hapus pengguna'}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />

      {/* Dialog tambah/edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle>
            <DialogDescription>
              {editing
                ? 'Perbaru data dan hak akses pengguna ini.'
                : 'Buat pengguna baru dan tetapkan hak aksesnya.'}
            </DialogDescription>
          </DialogHeader>

          <form id="user-form" onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Nama Lengkap</Label>
              <Input
                id="user-name"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="cth. Budi Santoso"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="email@contoh.co.id"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="user-role">Peran</Label>
                <Select value={form.role} onValueChange={(value) => updateField('role', value)}>
                  <SelectTrigger id="user-role">
                    <SelectValue placeholder="Pilih peran" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => updateField('status', value)}
                >
                  <SelectTrigger id="user-status">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-phone">Nomor Telepon (opsional)</Label>
              <Input
                id="user-phone"
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                placeholder="cth. 0812-3456-7890"
              />
            </div>
          </form>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button type="submit" form="user-form" disabled={saving}>
              {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah Pengguna'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Konfirmasi hapus */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        loading={deleting}
        title="Hapus pengguna?"
        description={
          <>
            Anda yakin ingin menghapus <strong>{targetDelete?.name}</strong> (
            {targetDelete?.email})? Tindakan ini tidak dapat dibatalkan.
          </>
        }
        confirmLabel="Ya, Hapus"
        onConfirm={handleDelete}
      />
    </div>
  )
}