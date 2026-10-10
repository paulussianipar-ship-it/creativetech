import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  FolderKanban,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react'
import {
  createProject,
  deleteProject,
  fetchProjects,
  toggleProjectStatus,
  updateProject,
} from '@/lib/api'
import { CATEGORY_OPTIONS, PROJECT_STATUS_OPTIONS } from '@/lib/constants'
import { formatDateTime, slugify } from '@/lib/format'
import PageHeader from '@/components/admin/page-header'
import SearchInput from '@/components/admin/search-input'
import FilterDropdown from '@/components/admin/filter-dropdown'
import StatusBadge from '@/components/admin/status-badge'
import ConfirmDialog from '@/components/admin/confirm-dialog'
import EmptyState from '@/components/admin/empty-state'
import Pagination from '@/components/admin/pagination'
import ImageUploader from '@/components/admin/image-uploader'
import RichTextEditor from '@/components/admin/rich-text-editor'
import { TableSkeleton } from '@/components/admin/table-skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { Switch } from '@/components/ui/switch'
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

const PAGE_SIZE = 10

export const EMPTY_FORM = {
  title: '',
  slug: '',
  category: 'design',
  status: 'draft',
  description: '',
  content: '',
  client: '',
  featured: false,
  images: [],
  image_url: null,
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(null)
  const [status, setStatus] = useState(null)
  const [page, setPage] = useState(1)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [targetDelete, setTargetDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadProjects = useCallback(async () => {
    setLoading(true)
    const { data, count, error } = await fetchProjects({
      search,
      category: category || 'all',
      status: status || 'all',
      page,
      pageSize: PAGE_SIZE,
    })
    if (error) {
      toast.error(error)
    } else {
      setProjects(data || [])
      setTotal(count || 0)
      if ((data?.length || 0) === 0 && page > 1) setPage(1)
    }
    setLoading(false)
  }, [search, category, status, page])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  function openAdd() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setSlugTouched(false)
    setDialogOpen(true)
  }

  function openEdit(project) {
    setEditing(project)
    setSlugTouched(true)
    setForm({
      title: project.title || '',
      slug: project.slug || '',
      category: project.category || 'design',
      status: project.status || 'draft',
      description: project.description || '',
      content: project.content || '',
      client: project.client || '',
      featured: Boolean(project.featured),
      images: project.images || [],
      image_url: project.image_url || null,
    })
    setDialogOpen(true)
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleTitleChange(value) {
    setForm((prev) => ({
      ...prev,
      title: value,
      // Auto-generate slug dari judul selama belum disentuh manual.
      slug: slugTouched ? prev.slug : slugify(value),
    }))
  }

  function handleSlugChange(value) {
    setSlugTouched(true)
    updateField('slug', slugify(value))
  }

  async function handleSave(event) {
    event.preventDefault()
    if (!form.title.trim()) {
      toast.error('Judul project wajib diisi.')
      return
    }
    const finalSlug = form.slug?.trim() || slugify(form.title)
    if (!finalSlug) {
      toast.error('Slug tidak valid. Cek kembali judul project.')
      return
    }

    const payload = {
      ...form,
      slug: finalSlug,
      image_url: form.image_url || (form.images[0]?.url ?? null),
    }

    setSaving(true)
    const result = editing
      ? await updateProject(editing.id, payload)
      : await createProject(payload)
    setSaving(false)

    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success(editing ? 'Project diperbarui.' : 'Project berhasil ditambahkan.')
    setDialogOpen(false)
    loadProjects()
  }

  async function handleToggleStatus(project) {
    const next = project.status === 'published' ? 'draft' : 'published'
    const { error } = await toggleProjectStatus(project.id, next)
    if (error) {
      toast.error(error)
      return
    }
    toast.success(next === 'published' ? 'Project diterbitkan.' : 'Project disembunyikan.')
    loadProjects()
  }

  function requestDelete(project) {
    setTargetDelete(project)
    setConfirmOpen(true)
  }

  async function handleDelete() {
    if (!targetDelete) return
    setDeleting(true)
    const { error } = await deleteProject(targetDelete.id)
    setDeleting(false)
    setConfirmOpen(false)
    setTargetDelete(null)
    if (error) {
      toast.error(error)
      return
    }
    toast.success('Project dihapus.')
    loadProjects()
  }

  const coverPreview = useMemo(
    () => form.image_url || form.images[0]?.url || null,
    [form.image_url, form.images],
  )

  return (
    <div className="space-y-5">
      <PageHeader
        title="Manajemen Project"
        description="Kelola daftar project dan portofolio layanan."
      >
        <Button onClick={openAdd}>
          <Plus />
          Tambah Project
        </Button>
      </PageHeader>

      {/* Pencarian & filter */}
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          placeholder="Cari judul, slug, atau klien..."
          className="w-full sm:w-72"
        />
        <div className="ml-auto flex items-center gap-2">
          <FilterDropdown
            label={
              category
                ? CATEGORY_OPTIONS.find((o) => o.value === category)?.label
                : 'Semua Kategori'
            }
            value={category}
            onChange={(value) => {
              setCategory(value)
              setPage(1)
            }}
            options={CATEGORY_OPTIONS}
          />
          <FilterDropdown
            label={
              status
                ? PROJECT_STATUS_OPTIONS.find((o) => o.value === status)?.label
                : 'Semua Status'
            }
            value={status}
            onChange={(value) => {
              setStatus(value)
              setPage(1)
            }}
            options={PROJECT_STATUS_OPTIONS}
          />
        </div>
      </div>

      {/* Daftar project */}
      {loading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Belum ada project"
          description="Mulai dengan menambahkan project pertama Anda, atau ubah filter pencarian."
          action={
            <Button onClick={openAdd} size="sm">
              <Plus />
              Tambah Project
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead className="hidden md:table-cell">Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Diperbarui</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                        {project.images?.[0]?.url || project.image_url ? (
                          <img
                            src={project.images?.[0]?.url || project.image_url}
                            alt={project.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FolderKanban className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 truncate font-medium">
                          {project.title}
                          {project.featured && (
                            <Sparkles className="h-3.5 w-3.5 shrink-0 text-warning" />
                          )}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          /project/{project.slug}
                          {project.client ? ` · ${project.client}` : ''}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary">
                      {CATEGORY_OPTIONS.find((o) => o.value === project.category)?.label ||
                        project.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">
                    {formatDateTime(project.updated_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleToggleStatus(project)}
                        title={project.status === 'published' ? 'Sembunyikan' : 'Terbitkan'}
                      >
                        {project.status === 'published' ? <EyeOff /> : <Eye />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        title="Lihat di website"
                      >
                        <a
                          href={`/project/${project.slug}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(project)}
                        title="Edit project"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => requestDelete(project)}
                        title="Hapus project"
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

      {/* Dialog tambah/edit project */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Project' : 'Tambah Project'}</DialogTitle>
            <DialogDescription>
              Lengkapi informasi project. Gambar dapat diunggah ke Supabase Storage.
            </DialogDescription>
          </DialogHeader>

          <form id="project-form" onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="project-title">Judul Project *</Label>
                <Input
                  id="project-title"
                  value={form.title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  placeholder="cth. Website Profile Perusahaan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-slug">Slug URL</Label>
                <Input
                  id="project-slug"
                  value={form.slug}
                  onChange={(event) => handleSlugChange(event.target.value)}
                  placeholder="auto dari judul"
                />
                <p className="text-xs text-muted-foreground">
                  /project/<span className="font-medium">{form.slug || slugify(form.title) || '...'}</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select value={form.category} onValueChange={(value) => updateField('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(value) => updateField('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="project-client">Klien (opsional)</Label>
                <Input
                  id="project-client"
                  value={form.client}
                  onChange={(event) => updateField('client', event.target.value)}
                  placeholder="Nama klien / perusahaan"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">Deskripsi Singkat</Label>
              <textarea
                id="project-description"
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Ringkasan project yang tampil di kartu portofolio..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <Label>Konten Lengkap</Label>
              <RichTextEditor
                value={form.content}
                onChange={(html) => updateField('content', html)}
                placeholder="Tulis detail project, fitur, hasil, dan testimoni di sini..."
              />
            </div>

            <div className="space-y-2">
              <Label>Gambar Project</Label>
              <Card>
                <CardContent className="p-4">
                  {coverPreview ? (
                    <div className="mb-3 flex items-center gap-3">
                      <img
                        src={coverPreview}
                        alt="Pratinjau sampul"
                        className="h-14 w-20 rounded-md border object-cover"
                      />
                      <div>
                        <p className="flex items-center gap-1 text-sm font-medium">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          Sampul terpilih
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Gambar pertama yang ditandai menjadi sampul project.
                        </p>
                      </div>
                    </div>
                  ) : null}
                  <ImageUploader
                    images={form.images}
                    onChange={(images) => updateField('images', images)}
                    coverUrl={form.image_url || form.images[0]?.url || null}
                    onCoverChange={(url) => updateField('image_url', url)}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="project-featured" className="font-medium">
                  Tampilkan sebagai Unggulan
                </Label>
                <p className="text-xs text-muted-foreground">
                  Project unggulan akan tampil lebih menonjol di beranda.
                </p>
              </div>
              <Switch
                id="project-featured"
                checked={form.featured}
                onCheckedChange={(checked) => updateField('featured', checked)}
              />
            </div>
          </form>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button type="submit" form="project-form" disabled={saving}>
              {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Simpan Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Konfirmasi hapus */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        loading={deleting}
        title="Hapus project?"
        description={
          <>
            Anda yakin ingin menghapus project <strong>{targetDelete?.title}</strong>? Tindakan ini
            tidak dapat dibatalkan.
          </>
        }
        confirmLabel="Ya, Hapus"
        onConfirm={handleDelete}
      />
    </div>
  )
}