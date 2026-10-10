import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Info, Save } from 'lucide-react'
import { fetchSettings, saveSettings } from '@/lib/api'
import { SETTINGS_FIELDS } from '@/lib/constants'
import PageHeader from '@/components/admin/page-header'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/context/AuthContext'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function Settings() {
  const { user } = useAuth()
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error } = await fetchSettings()
      if (cancelled) return
      if (error) {
        toast.error(error)
      } else {
        setValues(data || {})
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  function update(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave(event) {
    event.preventDefault()
    setSaving(true)
    const { error } = await saveSettings(values)
    setSaving(false)
    if (error) {
      toast.error(error)
      return
    }
    toast.success('Pengaturan berhasil disimpan.')
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Pengaturan Sistem"
        description="Konfigurasi umum website dan panel admin."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <form onSubmit={handleSave}>
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Website</CardTitle>
                <CardDescription>
                  Nama, kontak, dan preferensi umum yang dipakai di halaman publik.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {loading ? (
                  <div className="space-y-4">
                    {[0, 1, 2, 3].map((item) => (
                      <div key={item} className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-9 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  SETTINGS_FIELDS.map((field) => {
                    const current = values[field.key]

                    if (field.type === 'switch') {
                      return (
                        <div
                          key={field.key}
                          className="flex items-center justify-between gap-4 rounded-lg border p-3"
                        >
                          <div>
                            <Label htmlFor={`setting-${field.key}`} className="font-medium">
                              {field.label}
                            </Label>
                          </div>
                          <Switch
                            id={`setting-${field.key}`}
                            checked={Boolean(current)}
                            onCheckedChange={(checked) => update(field.key, checked)}
                          />
                        </div>
                      )
                    }

                    if (field.type === 'select') {
                      return (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={`setting-${field.key}`}>{field.label}</Label>
                          <Select
                            value={current}
                            onValueChange={(value) => update(field.key, value)}
                          >
                            <SelectTrigger id={`setting-${field.key}`}>
                              <SelectValue placeholder="Pilih..." />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )
                    }

                    return (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={`setting-${field.key}`}>{field.label}</Label>
                        <Input
                          id={`setting-${field.key}`}
                          type={field.type === 'number' ? 'number' : 'text'}
                          value={current ?? ''}
                          onChange={(event) => update(field.key, event.target.value)}
                          placeholder={`Masukkan ${field.label.toLowerCase()}...`}
                        />
                      </div>
                    )
                  })
                )}
              </CardContent>
              <div className="flex items-center justify-end gap-2 border-t px-5 py-4">
                <Button type="submit" disabled={saving || loading}>
                  {saving ? 'Menyimpan...' : (
                    <>
                      <Save />
                      Simpan Pengaturan
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </form>

          {!isSupabaseConfigured && (
            <Alert
              variant="warning"
              icon={Info}
              title="Koneksi data lokal"
              description="Perubahan hanya tersimpan di browser selama mode demo. Sambungkan Supabase untuk penyimpanan permanen."
            />
          )}
        </div>

        {/* Informasi akun */}
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Akun Anda</CardTitle>
              <CardDescription>Detail sesi yang sedang aktif.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Nama</p>
                <p className="font-medium">{user?.name || '-'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email || '-'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Sumber Data</p>
                <p className="font-medium">{isSupabaseConfigured ? 'Supabase' : 'Demo (lokal)'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zona Admin</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Semua aksi admin (tambah, ubah, hapus) dicatat ke tabel{' '}
                <code className="rounded bg-muted px-1 py-0.5">audit_logs</code> dan bisa dilihat
                pada menu Log Aktivitas.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}