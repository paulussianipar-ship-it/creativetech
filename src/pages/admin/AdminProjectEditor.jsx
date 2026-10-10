import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLang } from '../../contexts/LangContext'
import { useAuth } from '../../contexts/AuthContext'
import { fetchAllProjects, upsertProject, uploadProjectImage, deleteProjectImage, writeAuditLog } from '../../lib/api'
import { slugify } from '../../lib/utils'
import { toast } from 'sonner'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { ArrowLeft, Upload, X, Bold, Italic, List, Heading2, ImageIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function AdminProjectEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLang()
  const { profile } = useAuth()
  const isNew = !id

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: '',
    status: 'draft',
    description: '',
    client: '',
    featured: false,
  })
  const [images, setImages] = useState([])
  const [coverUrl, setCoverUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [projectId, setProjectId] = useState(id || null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({ placeholder: 'Write project content here…' }),
    ],
    content: '',
  })

  // Load existing project
  useEffect(() => {
    if (!id) return
    fetchAllProjects().then(projects => {
      const p = projects.find(x => x.id === id)
      if (!p) return
      setForm({
        title: p.title,
        slug: p.slug,
        category: p.category,
        status: p.status,
        description: p.description || '',
        client: p.client || '',
        featured: p.featured,
      })
      setCoverUrl(p.image_url || '')
      setImages(p.images || [])
      if (editor) editor.commands.setContent(p.content || '')
    })
  }, [id, editor])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && isNew ? { slug: slugify(value) } : {}),
    }))
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!projectId) {
      toast.error('Save the project first to upload images.')
      return
    }
    setUploading(true)
    try {
      const img = await uploadProjectImage(file, projectId)
      setImages(imgs => [...imgs, img])
      if (!coverUrl) setCoverUrl(img.url)
      toast.success('Image uploaded.')
    } catch (err) {
      toast.error('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleRemoveImage(img) {
    try {
      await deleteProjectImage(img.path)
      setImages(imgs => imgs.filter(i => i.path !== img.path))
      if (coverUrl === img.url) setCoverUrl(images.find(i => i.path !== img.path)?.url || '')
      toast.success('Image removed.')
    } catch {
      toast.error('Failed to remove image.')
    }
  }

  async function handleSave() {
    if (!form.title || !form.slug) {
      toast.error('Title and slug are required.')
      return
    }
    setSaving(true)
    try {
      const content = editor?.getHTML() || ''
      const coverImage = images[0] ? { path: images[0].path, url: images[0].url, name: images[0].name } : null
      const payload = {
        ...(projectId ? { id: projectId } : {}),
        ...form,
        content,
        image_url: coverUrl || images[0]?.url || null,
        images,
        created_by: profile?.id,
      }
      const saved = await upsertProject(payload)
      if (!projectId) setProjectId(saved.id)
      await writeAuditLog({
        actorEmail: profile?.email,
        action: isNew ? 'create' : 'update',
        entity: 'project',
        entityId: saved.id,
        description: `${isNew ? 'Created' : 'Updated'} project: ${form.title}`,
      })
      toast.success(isNew ? 'Project created!' : 'Project saved!')
      if (isNew) navigate(`/admin/projects/${saved.id}/edit`, { replace: true })
    } catch (err) {
      toast.error('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/projects')} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-bold">{isNew ? t.admin.new : t.admin.edit + ' Project'}</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          id="btn-project-save"
          className="ml-auto px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {saving ? t.admin.saving : t.admin.save}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Slug *</label>
            <input name="slug" value={form.slug} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono" />
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Short Description</label>
            <textarea name="description" rows={3} value={form.description} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          {/* Rich text editor */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Content</label>
            {/* Toolbar */}
            {editor && (
              <div className="flex items-center gap-1 p-2 border border-border border-b-0 rounded-t-lg bg-muted/40">
                {[
                  { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
                  { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
                  { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
                  { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
                ].map(({ icon: Icon, action, active }, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={action}
                    className={cn('p-1.5 rounded transition-colors', active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            )}
            <div className="border border-border rounded-b-lg bg-background min-h-[200px] px-4 py-3 prose prose-neutral dark:prose-invert max-w-none text-sm [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[150px]">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="draft">{t.admin.draft}</option>
                <option value="published">{t.admin.published}</option>
                <option value="archived">{t.admin.archived}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <input name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Client</label>
              <input name="client" value={form.client} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 rounded border-input accent-primary" />
              <span className="text-sm font-medium">{t.admin.featured}</span>
            </label>
          </div>

          {/* Images */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-medium">Images</h3>
            {/* Upload button */}
            <label className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-input cursor-pointer text-sm text-muted-foreground hover:bg-muted transition-colors',
              uploading && 'opacity-50 pointer-events-none'
            )}>
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading…' : 'Upload image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            {!projectId && (
              <p className="text-xs text-muted-foreground">Save the project first to enable uploads.</p>
            )}
            {/* Image list */}
            <div className="space-y-2">
              {images.map(img => (
                <div key={img.path} className="flex items-center gap-2 group">
                  <img src={img.url} alt={img.name} className="w-12 h-12 rounded-lg object-cover border border-border" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs truncate font-medium">{img.name}</div>
                    {coverUrl === img.url && <div className="text-xs text-primary">Cover</div>}
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setCoverUrl(img.url)}
                      className="text-xs px-2 py-1 rounded hover:bg-muted transition-colors"
                      title="Set as cover"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img)}
                      className="text-xs px-2 py-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
