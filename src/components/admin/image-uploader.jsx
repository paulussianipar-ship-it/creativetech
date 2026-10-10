import { useRef, useState } from 'react'
import { ImagePlus, Loader2, Star, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { removeProjectImage, uploadProjectImage } from '@/lib/api'
import { isSupabaseConfigured } from '@/lib/supabase'

/**
 * Unggah beberapa gambar untuk project ke Supabase Storage.
 *
 * `images` — daftar { path, url, name }.
 * `onChange` — menerima daftar baru.
 * `onCoverChange` — menandai gambar sampul (opsional).
 */
export default function ImageUploader({
  images = [],
  onChange,
  coverUrl,
  onCoverChange,
  max = 6,
}) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  async function handleFiles(files) {
    const list = Array.from(files || [])
    if (!list.length) return

    if (images.length + list.length > max) {
      toast.error(`Maksimal ${max} gambar per project.`)
      return
    }

    setUploading(true)
    try {
      // Akumulator lokal: daftar `images` dari props bisa basi antar iterasi.
      let current = [...images]
      for (const file of list) {
        const { data, error } = await uploadProjectImage(file)
        if (error) {
          toast.error(error)
          continue
        }
        current = [...current, data]
        onChange(current)
        if (!coverUrl && current.length === 1) onCoverChange?.(data.url)
      }
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleRemove(item) {
    const next = images.filter((image) => image.path !== item.path)
    onChange(next)
    if (coverUrl === item.url) {
      const newCover = next.length ? next[0] : null
      onCoverChange?.(newCover?.url || null)
    }
    toast.success('Gambar dihapus.')

    // Opsional: hapus berkas dari Storage.
    if (isSupabaseConfigured) {
      removeProjectImage(item.path).then(({ error }) => {
        if (error) toast.error(error)
      })
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image) => {
          const isCover = coverUrl === image.url
          return (
            <div
              key={image.path || image.url}
              className={cn(
                'group relative aspect-video overflow-hidden rounded-lg border bg-muted',
                isCover && 'ring-2 ring-primary',
              )}
            >
              <img
                src={image.url}
                alt={image.name || 'Gambar project'}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-1.5">
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="secondary"
                    onClick={() => onCoverChange?.(image.url)}
                    title="Jadikan sampul"
                    className={cn(isCover && 'bg-amber-100 text-amber-700')}
                  >
                    <Star className={cn(isCover && 'fill-amber-500 text-amber-500')} />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="destructive"
                    onClick={() => handleRemove(image)}
                    title="Hapus gambar"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
              {isCover && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                  Sampul
                </span>
              )}
            </div>
          )
        })}

        {/* Tombol unggah */}
        {(images.length < max || uploading) && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className={cn(
              'flex aspect-video flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed text-muted-foreground transition-colors',
              'hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-xs font-medium">Mengunggah...</span>
              </>
            ) : (
              <>
                <ImagePlus className="h-5 w-5" />
                <span className="text-xs font-medium">Tambah Gambar</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        multiple
        hidden
        onChange={(event) => handleFiles(event.target.files)}
      />

      <p className="text-xs text-muted-foreground">
        JPG, PNG, WEBP, GIF, atau AVIF &mdash; maksimal 5MB per berkas ({images.length}/{max}
        {!isSupabaseConfigured && ' &mdash; mode demo: gambar bersifat sementara'}).
      </p>
    </div>
  )
}