import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Inbox, Mail, MailOpen, Trash2 } from 'lucide-react'
import {
  deleteContactMessage,
  fetchContactMessages,
  setContactMessageRead,
} from '@/lib/api'
import PageHeader from '@/components/admin/page-header'
import SearchInput from '@/components/admin/search-input'
import FilterDropdown from '@/components/admin/filter-dropdown'
import EmptyState from '@/components/admin/empty-state'
import ConfirmDialog from '@/components/admin/confirm-dialog'
import Pagination from '@/components/admin/pagination'
import { TableSkeleton } from '@/components/admin/table-skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateTime, initials, truncate } from '@/lib/format'

const PAGE_SIZE = 10

const STATUS_OPTIONS = [
  { value: 'unread', label: 'Belum dibaca' },
  { value: 'read', label: 'Sudah dibaca' },
]

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(null)
  const [page, setPage] = useState(1)

  const [selected, setSelected] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [targetDelete, setTargetDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, count, error } = await fetchContactMessages({
      search,
      status: status || 'all',
      page,
      pageSize: PAGE_SIZE,
    })
    if (error) {
      toast.error(error)
    } else {
      setMessages(data || [])
      setTotal(count || 0)
      if ((data?.length || 0) === 0 && page > 1) setPage(1)
    }
    setLoading(false)
  }, [search, status, page])

  useEffect(() => {
    load()
  }, [load])

  async function openMessage(message) {
    setSelected(message)
    if (!message.read) {
      const { error } = await setContactMessageRead(message.id, true)
      if (!error) {
        setMessages((prev) =>
          prev.map((row) => (row.id === message.id ? { ...row, read: true } : row)),
        )
      }
    }
  }

  async function toggleRead(message, event) {
    event.stopPropagation()
    const next = !message.read
    const { error } = await setContactMessageRead(message.id, next)
    if (error) {
      toast.error(error)
      return
    }
    setMessages((prev) =>
      prev.map((row) => (row.id === message.id ? { ...row, read: next } : row)),
    )
  }

  function requestDelete(message, event) {
    event.stopPropagation()
    setTargetDelete(message)
    setConfirmOpen(true)
  }

  async function handleDelete() {
    if (!targetDelete) return
    setDeleting(true)
    const { error } = await deleteContactMessage(targetDelete.id)
    setDeleting(false)
    setConfirmOpen(false)
    setTargetDelete(null)
    if (error) {
      toast.error(error)
      return
    }
    toast.success('Pesan dihapus.')
    load()
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Pesan Masuk"
        description="Pesan yang dikirim pengunjung melalui formulir kontak website."
      />

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          placeholder="Cari nama, email, atau isi pesan..."
          className="w-full sm:w-72"
        />
        <div className="ml-auto">
          <FilterDropdown
            label={
              status
                ? STATUS_OPTIONS.find((o) => o.value === status)?.label
                : 'Semua Status'
            }
            value={status}
            onChange={(value) => {
              setStatus(value)
              setPage(1)
            }}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={6} columns={4} />
      ) : messages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Belum ada pesan"
          description="Pesan yang dikirim dari formulir kontak publik akan muncul di sini."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengirim</TableHead>
                <TableHead className="hidden md:table-cell">Topik</TableHead>
                <TableHead className="hidden lg:table-cell">Pesan</TableHead>
                <TableHead className="hidden sm:table-cell">Diterima</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow
                  key={message.id}
                  onClick={() => openMessage(message)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-[11px]">
                          {initials(message.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 truncate font-medium">
                          {message.name}
                          {!message.read && (
                            <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {message.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {message.topic ? (
                      <Badge variant="secondary">{message.topic}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden max-w-xs lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {truncate(message.message, 70)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                    {formatDateTime(message.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(event) => toggleRead(message, event)}
                        title={message.read ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                      >
                        {message.read ? <MailOpen /> : <Mail />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={(event) => requestDelete(message, event)}
                        title="Hapus pesan"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.topic || 'Pesan Kontak'}</DialogTitle>
            <DialogDescription>
              {selected ? `${selected.name} · ${selected.email}` : ''}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {selected.message}
              </p>
              <p className="text-xs text-muted-foreground">
                Diterima {formatDateTime(selected.created_at)}
              </p>
              <a
                href={`mailto:${selected.email}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                Balas via Email
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        loading={deleting}
        title="Hapus pesan?"
        description={
          <>
            Anda yakin ingin menghapus pesan dari{' '}
            <strong>{targetDelete?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
          </>
        }
        confirmLabel="Ya, Hapus"
        onConfirm={handleDelete}
      />
    </div>
  )
}
