import { Badge } from '@/components/ui/badge'
import { ROLE_LABELS } from '@/lib/constants'

const ROLE_VARIANTS = {
  admin: 'default',
  editor: 'warning',
  user: 'secondary',
}

/** Lencana peran pengguna. */
export default function RoleBadge({ role }) {
  const label = ROLE_LABELS[role] || role || 'Pengguna'
  return <Badge variant={ROLE_VARIANTS[role] || 'secondary'}>{label}</Badge>
}