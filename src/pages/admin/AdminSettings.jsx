import { useEffect, useState } from 'react'
import { useLang } from '../../contexts/LangContext'
import { useAuth } from '../../contexts/AuthContext'
import { fetchSettings, saveSettings, writeAuditLog } from '../../lib/api'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

export default function AdminSettings() {
  const { t } = useLang()
  const { profile } = useAuth()
  const [settings, setSettings] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => toast.error('Failed to load settings.'))
  }, [])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setSettings(s => ({ ...s, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await saveSettings(settings)
      await writeAuditLog({
        actorEmail: profile?.email,
        action: 'update',
        entity: 'settings',
        entityId: settings.id,
        description: 'Updated site settings',
      })
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  if (!settings) return <div className="p-8 text-muted-foreground text-sm">Loading…</div>

  const fields = [
    { key: 'siteName', label: 'Site Name', type: 'text' },
    { key: 'tagline', label: 'Tagline', type: 'text' },
    { key: 'contactEmail', label: 'Contact Email', type: 'email' },
    { key: 'defaultLanguage', label: 'Default Language', type: 'select', options: [{ value: 'id', label: 'Indonesian' }, { value: 'en', label: 'English' }] },
    { key: 'itemsPerPage', label: 'Items Per Page', type: 'number' },
  ]

  const toggles = [
    { key: 'maintenanceMode', label: 'Maintenance Mode' },
    { key: 'allowRegistration', label: 'Allow Registration' },
  ]

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">{t.admin.settings}</h1>

      <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 space-y-5">
        {fields.map(({ key, label, type, options }) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1.5">{label}</label>
            {type === 'select' ? (
              <select
                name={key}
                value={settings[key] ?? ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <input
                type={type}
                name={key}
                value={settings[key] ?? ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            )}
          </div>
        ))}

        {/* Toggles */}
        <div className="space-y-3 pt-2">
          {toggles.map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-muted transition-colors">
              <span className="text-sm font-medium">{label}</span>
              <div className="relative">
                <input
                  type="checkbox"
                  name={key}
                  checked={!!settings[key]}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-muted rounded-full peer-checked:bg-primary transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          id="btn-settings-save"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-60 w-full justify-center"
        >
          <Save className="w-4 h-4" />
          {saving ? t.admin.saving : t.admin.save}
        </button>
      </form>
    </div>
  )
}
