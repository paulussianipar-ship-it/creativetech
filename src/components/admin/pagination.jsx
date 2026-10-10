import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Pagination Indonesia. `page` mulai dari 1.
 */
export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}) {
  if (!total) return null

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (totalPages <= 1) return null

  const rangeStart = (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, total)
  const pages = getPageList(page, totalPages)

  return (
    <div className={cn('flex flex-col items-center justify-between gap-3 sm:flex-row', className)}>
      <p className="text-xs font-medium text-muted-foreground">
        Menampilkan <span className="font-semibold text-foreground">{rangeStart}</span>–
        <span className="font-semibold text-foreground">{rangeEnd}</span> dari{' '}
        <span className="font-semibold text-foreground">{total}</span> data
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft />
        </Button>

        {pages.map((p, index) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-1.5 text-sm text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? 'default' : 'ghost'}
              size="icon-sm"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className="min-w-8"
            >
              {p}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon-sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}

function getPageList(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const list = new Set([1, total, current, current - 1, current + 1])
  const sorted = [...list].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)

  const result = []
  let prev = 0
  for (const page of sorted) {
    if (page - prev > 1) result.push('ellipsis')
    result.push(page)
    prev = page
  }
  return result
}