import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ScrollText } from 'lucide-react'
import { fetchAuditLogs } from '@/lib/api'
import { AUDIT_ACTIONS } from '@/lib/constants'
import { formatDateTime } from '@/lib/format'
import PageHeader from '@/components/admin/page-header'
import EmptyState from '@/components/admin/empty-state'
import Pagination from '@/components/admin/pagination'
import { TableSkeleton } from '@/components/admin/table-skeleton'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const PAGE_SIZE = 12

const ACTION_VARIANTS = {
  create: 'success',
  update: 'warning',
  delete: 'destructive',
  upload: 'default',
  login: 'secondary',
  logout: 'muted',
}

export default function AuditLog() {
  const [logs, setLogs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const loadLogs = useCallback(async () => {
    setLoading(true)
    const { data, count, error } = await fetchAuditLogs({ page, pageSize: PAGE_SIZE })
    if (error) {
      toast.error(error)
    } else {
      setLogs(data || [])
      setTotal(count || 0)
      if ((data?.length || 0) === 0 && page > 1) setPage(1)
    }
    setLoading(false)
  }, [page])

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Log Aktivitas"
        description="Riwayat perubahan data yang dilakukan administrator."
      />

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-4">
            <TableSkeleton rows={6} columns={4} />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={ScrollText}
              title="Belum ada aktivitas"
              description="Tambah, ubah, atau hapus data untuk mulai mencatat aktivitas."
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Aktor</TableHead>
                <TableHead>Aksi</TableHead>
                <TableHead className="hidden md:table-cell">Deskripsi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {formatDateTime(log.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">
                          {log.actor?.slice(0, 2).toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="max-w-[160px] truncate text-sm">{log.actor || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ACTION_VARIANTS[log.action] || 'muted'}>
                      {AUDIT_ACTIONS[log.action] || log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden max-w-md truncate text-sm md:table-cell">
                    {log.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
    </div>
  )
}