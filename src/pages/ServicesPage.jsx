import { useLang } from '../contexts/LangContext'
import { Palette, Code2, Sparkles, Lightbulb, Smartphone, BarChart2, Globe } from 'lucide-react'

const SERVICE_ICONS = [Palette, Code2, Sparkles, Lightbulb, Smartphone, BarChart2]

export default function ServicesPage() {
  const { t } = useLang()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 gradient-text">{t.services.title}</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">{t.services.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {t.services.items.map((svc, i) => {
          const Icon = SERVICE_ICONS[i] || Globe
          return (
            <div key={svc.title} className="group p-8 rounded-2xl bg-card border border-border card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full" />
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-bold text-xl mb-3">{svc.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{svc.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
