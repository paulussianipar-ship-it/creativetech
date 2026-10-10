import { useState } from 'react'
import { useLang } from '../contexts/LangContext'
import { submitContactMessage } from '../lib/api'
import { toast } from 'sonner'
import { Send, Mail, MapPin, Phone } from 'lucide-react'

export default function ContactPage() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' })
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await submitContactMessage(form)
      toast.success(t.contact.success)
      setForm({ name: '', email: '', topic: '', message: '' })
    } catch {
      toast.error(t.contact.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 gradient-text">{t.contact.title}</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">{t.contact.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Info */}
        <div className="lg:col-span-2 space-y-6">
          {[
            { icon: Mail, label: 'Email', value: 'hello@creativetech.id' },
            { icon: Phone, label: 'WhatsApp', value: '+62 812-3456-7890' },
            { icon: MapPin, label: 'Location', value: 'Indonesia' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium">{label}</div>
                <div className="font-semibold text-sm">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5 bg-card border border-border rounded-2xl p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="contact-name">{t.contact.name}</label>
              <input
                id="contact-name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="contact-email">{t.contact.email}</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="contact-topic">{t.contact.topic}</label>
            <input
              id="contact-topic"
              name="topic"
              value={form.topic}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="contact-message">{t.contact.message}</label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            id="btn-contact-submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:opacity-90 transition disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            {loading ? t.contact.sending : t.contact.send}
          </button>
        </form>
      </div>
    </div>
  )
}
