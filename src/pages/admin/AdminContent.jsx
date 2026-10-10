import { useEffect, useState } from 'react'
import { useLang } from '../../contexts/LangContext'
import { useAuth } from '../../contexts/AuthContext'
import { fetchContent, saveContent, writeAuditLog } from '../../lib/api'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

const SECTIONS = ['home', 'about', 'services', 'contact']

export default function AdminContent() {
  const { t } = useLang()
  const { profile } = useAuth()
  const [activeSection, setActiveSection] = useState('home')
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchContent(activeSection)
      .then(setContent)
      .catch(() => toast.error('Failed to load content.'))
      .finally(() => setLoading(false))
  }, [activeSection])

  function handleChange(key, value) {
    setContent(c => ({ ...c, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await saveContent(activeSection, content, profile?.id)
      await writeAuditLog({
        actorEmail: profile?.email,
        action: 'update',
        entity: 'content',
        entityId: activeSection,
        description: `Updated content: ${activeSection}`,
      })
      toast.success('Content saved!')
    } catch {
      toast.error('Failed to save content.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{t.admin.content}</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          id="btn-content-save"
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? t.admin.saving : t.admin.save}
        </button>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {SECTIONS.map(s => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize border ${
              activeSection === s
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:bg-muted'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-muted rounded animate-pulse" />)}</div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <p className="text-xs text-muted-foreground">
            Edit the JSON content for the <span className="font-semibold capitalize">{activeSection}</span> section. These values override defaults.
          </p>
          {Object.keys(content).length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">No content set yet. Add key-value pairs below.</p>
              <div className="flex gap-2">
                <input
                  placeholder="Key (e.g. hero_title)"
                  id="content-new-key"
                  className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.target.value) {
                      handleChange(e.target.value, '')
                      e.target.value = ''
                    }
                  }}
                />
                <span className="text-xs text-muted-foreground self-center">Press Enter to add</span>
              </div>
            </div>
          ) : (
            <>
              {Object.entries(content).map(([key, val]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{key}</label>
                  {typeof val === 'string' && val.length > 100 ? (
                    <textarea
                      rows={4}
                      value={val}
                      onChange={e => handleChange(key, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={typeof val === 'string' ? val : JSON.stringify(val)}
                      onChange={e => handleChange(key, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <input
                  placeholder="Add new key…"
                  id="content-add-key"
                  className="flex-1 px-3 py-2 rounded-lg border border-dashed border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.target.value) {
                      handleChange(e.target.value, '')
                      e.target.value = ''
                    }
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
