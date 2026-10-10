import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { FileText, RotateCcw, Save } from 'lucide-react'
import { fetchAllContent, saveContent } from '@/lib/api'
import { CONTENT_FIELDS, CONTENT_SECTIONS } from '@/lib/constants'
import PageHeader from '@/components/admin/page-header'
import RichTextEditor from '@/components/admin/rich-text-editor'
import EmptyState from '@/components/admin/empty-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

/** Editor teks berbasis key-value per section halaman. */
export default function Content() {
  const [sections, setSections] = useState({})
  const [drafts, setDrafts] = useState({})
  const [activeSection, setActiveSection] = useState(CONTENT_SECTIONS[0]?.key)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedKey, setSavedKey] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error } = await fetchAllContent()
      if (cancelled) return
      if (error) {
        toast.error(error)
        setLoading(false)
        return
      }
      setSections(data || {})
      setDrafts(JSON.parse(JSON.stringify(data || {})))
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const currentDraft = drafts[activeSection] || {}
  const currentSaved = sections[activeSection] || {}
  const hasChanges =
    JSON.stringify(currentDraft) !== JSON.stringify(currentSaved)

  function updateDraft(key, value) {
    setDrafts((prev) => ({
      ...prev,
      [activeSection]: { ...(prev[activeSection] || {}), [key]: value },
    }))
  }

  function discardChanges() {
    setDrafts((prev) => ({
      ...prev,
      [activeSection]: JSON.parse(JSON.stringify(sections[activeSection] || {})),
    }))
  }

  async function handleSave() {
    const values = currentDraft
    setSaving(true)
    const { error } = await saveContent(activeSection, values)
    setSaving(false)
    if (error) {
      toast.error(error)
      return
    }
    setSections((prev) => ({ ...prev, [activeSection]: JSON.parse(JSON.stringify(values)) }))
    setSavedKey(activeSection)
    toast.success('Konten berhasil disimpan.')
    window.setTimeout(() => setSavedKey(null), 2500)
  }

  const fields = CONTENT_FIELDS[activeSection] || []

  return (
    <div className="space-y-5">
      <PageHeader
        title="Konten Website"
        description="Perbarui teks yang tampil di halaman publik."
      />

      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="flex w-full flex-wrap justify-start sm:w-auto">
          {CONTENT_SECTIONS.map((section) => (
            <TabsTrigger
              key={section.key}
              value={section.key}
              className="flex-1 sm:flex-none"
            >
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CONTENT_SECTIONS.map((section) => (
          <TabsContent key={section.key} value={section.key}>
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle>Konten {section.label}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {hasChanges
                      ? 'Ada perubahan yang belum disimpan.'
                      : 'Semua perubahan telah tersimpan.'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {hasChanges && (
                    <Button variant="ghost" size="sm" onClick={discardChanges}>
                      <RotateCcw />
                      Kembalikan
                    </Button>
                  )}
                  <Button size="sm" onClick={handleSave} disabled={saving || !hasChanges}>
                    {saving ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save />
                        Simpan
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {loading ? (
                  <div className="space-y-4">
                    {[0, 1, 2].map((item) => (
                      <div key={item} className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-9 w-full" />
                      </div>
                    ))}
                  </div>
                ) : fields.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="Belum ada kolom konten"
                    description="Tambahkan kolom pada definisi CONTENT_FIELDS agar section ini bisa diedit."
                  />
                ) : (
                  fields.map((field) => {
                    const value = currentDraft[field.key] ?? ''
                    return (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={`${section.key}-${field.key}`}>{field.label}</Label>

                        {field.type === 'textarea' && field.rich ? (
                          <RichTextEditor
                            value={value}
                            onChange={(html) => updateDraft(field.key, html)}
                            placeholder={`Tulis ${field.label.toLowerCase()} di sini...`}
                          />
                        ) : field.type === 'textarea' ? (
                          <textarea
                            id={`${section.key}-${field.key}`}
                            value={value}
                            onChange={(event) => updateDraft(field.key, event.target.value)}
                            rows={4}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        ) : (
                          <Input
                            id={`${section.key}-${field.key}`}
                            value={value}
                            onChange={(event) => updateDraft(field.key, event.target.value)}
                            placeholder={`Masukkan ${field.label.toLowerCase()}...`}
                          />
                        )}
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}