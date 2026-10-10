import { Badge } from '@/components/ui/badge'
import { PROJECT_STATUS_LABELS } from '@/lib/constants'

const STATUS_VARIANTS = {
  published: 'success',
  draft: 'warning',
  archived: 'muted',
}

/** Lencana status project. */
export default function StatusBadge({ status }) {
  return (
    <Badge variant={STATUS_VARIANTS[status] || 'muted'}>
      {PROJECT_STATUS_LABELS[status] || status || '—'}
    </Badge>
  )
}