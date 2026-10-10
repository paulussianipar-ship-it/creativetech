import { useLang } from '../contexts/LangContext'
import { Target, Heart, Zap } from 'lucide-react'

export default function AboutPage() {
  const { t } = useLang()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 gradient-text">{t.about.title}</h1>
        <p className="text-lg text-muted-foreground">{t.about.subtitle}</p>
      </div>

      {/* Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">{t.about.mission}</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">{t.about.mission_text}</p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { icon: Target, label: 'Focused', desc: 'Result-driven approach' },
              { icon: Heart, label: 'Passionate', desc: 'We love what we do' },
              { icon: Zap, label: 'Fast', desc: 'Quick delivery, high quality' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="text-center p-4 rounded-xl bg-muted/50">
                <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-semibold text-sm">{label}</div>
                <div className="text-xs text-muted-foreground mt-1">{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-primary/20 via-indigo-500/10 to-transparent border border-border flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-6xl font-black gradient-text mb-2">5+</div>
            <div className="text-muted-foreground">Years of Experience</div>
            <div className="text-5xl font-black gradient-text mt-6 mb-2">50+</div>
            <div className="text-muted-foreground">Projects Delivered</div>
            <div className="text-5xl font-black gradient-text mt-6 mb-2">100%</div>
            <div className="text-muted-foreground">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  )
}
