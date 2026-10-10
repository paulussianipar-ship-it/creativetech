import { Boxes } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/** Baris skeleton untuk tabel yang sedang memuat. */
export function TableSkeleton({ rows = 5, columns = 5, className }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 rounded-lg border bg-background p-3">
          {Array.from({ length: columns }, (_, columnIndex) => (
            <Skeleton
              key={columnIndex}
              className={cn('h-5', columnIndex === 0 ? 'w-40' : 'flex-1')}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/** Pemuat data ringkas (memperlihatkan ikon + pesan). */
export function InlineLoader({ label = 'Memuat data...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <Boxes className="h-6 w-6 animate-pulse text-muted-foreground" />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  )
}