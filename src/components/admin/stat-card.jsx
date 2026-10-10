import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/** Kartu statistik untuk ringkasan dashboard. */
export default function StatCard({ title, value, icon: Icon, hint, trend, loading, className }) {
  const TrendIcon = trend && trend.direction === 'down' ? TrendingDown : TrendingUp

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="flex items-start gap-4 p-5">
        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          {loading ? (
            <Skeleton className="mt-2 h-7 w-16" />
          ) : (
            <p className="mt-1 text-2xl font-bold leading-none">{value}</p>
          )}
          <div className="mt-2 flex items-center gap-2">
            {trend && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs font-medium',
                  trend.direction === 'down' ? 'text-destructive' : 'text-emerald-600',
                )}
              >
                <TrendIcon className="h-3.5 w-3.5" />
                {trend.value}
              </span>
            )}
            {hint && <span className="truncate text-xs text-muted-foreground">{hint}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}