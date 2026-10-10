import { useEffect, useState } from 'react'
import { useLang } from '../../contexts/LangContext'
import { useAuth } from '../../contexts/AuthContext'
import { fetchContactMessages, markMessageRead, deleteContactMessage } from '../../lib/api'
import { formatDate } from '../../lib/utils'
import { toast } from 'sonner'
import { Trash2, CheckCircle, Circle, Mail } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function AdminMessages() {
  const { t, lang } = useLang()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  async function load() {
    try {
      const data = await fetchContactMessages()
      setMessages(data)
    } catch {
      toast.error('Failed to load messages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleToggleRead(msg) {
    try {
      await markMessageRead(msg.id, !msg.read)
      load()
    } catch {
      toast.error('Failed to update message.')
    }
  }

  async function handleDelete(msg) {
    if (!window.confirm(t.admin.confirm_delete)) return
    try {
      await deleteContactMessage(msg.id)
      if (selected?.id === msg.id) setSelected(null)
      toast.success('Message deleted.')
      load()
    } catch {
      toast.error('Failed to delete message.')
    }
  }

  return (
    <div className="p-6 sm:p-8 h-full">
      <h1 className="text-2xl font-bold mb-6">{t.admin.messages}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-180px)]">
        {/* List */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {messages.filter(m => !m.read).length} unread
          </div>
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-4 space-y-2">
                {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-muted rounded animate-pulse" />)}
              </div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                <Mail className="w-8 h-8 opacity-30" />
                No messages yet.
              </div>
            ) : (
              messages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => setSelected(msg)}
                  className={cn(
                    'w-full text-left px-4 py-3.5 border-b border-border transition-colors',
                    selected?.id === msg.id ? 'bg-accent' : 'hover:bg-muted/40',
                    !msg.read && 'border-l-2 border-l-primary'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className={cn('text-sm font-medium truncate', !msg.read && 'font-semibold')}>{msg.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{msg.email}</div>
                      {msg.topic && <div className="text-xs text-primary truncate">{msg.topic}</div>}
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                      {formatDate(msg.created_at, lang === 'en' ? 'en-US' : 'id-ID')}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-3 bg-card border border-border rounded-2xl overflow-hidden">
          {selected ? (
            <div className="flex flex-col h-full">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{selected.name}</h2>
                  <p className="text-xs text-muted-foreground">{selected.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(selected)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title={selected.read ? t.admin.unread : t.admin.read}
                  >
                    {selected.read ? <CheckCircle className="w-4 h-4 text-success" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  <button
                    onClick={() => handleDelete(selected)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title={t.admin.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                {selected.topic && (
                  <div className="text-xs font-semibold text-primary mb-4">Topic: {selected.topic}</div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                <div className="mt-6 text-xs text-muted-foreground">
                  {formatDate(selected.created_at, lang === 'en' ? 'en-US' : 'id-ID')}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm flex-col gap-2">
              <Mail className="w-10 h-10 opacity-20" />
              Select a message to read
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
