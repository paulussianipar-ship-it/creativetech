import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Tampilan saat daftar data kosong. */
export default function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-background px-6 py-14 text-center',
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold">{title}</p>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}