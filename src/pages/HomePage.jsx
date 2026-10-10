import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../contexts/LangContext'
import { fetchPublishedProjects } from '../lib/api'
import { truncate } from '../lib/utils'
import { ArrowRight, Sparkles, Code2, Palette, Smartphone, BarChart2, Lightbulb, Globe } from 'lucide-react'
import { cn } from '../lib/utils'

const SERVICE_ICONS = [Palette, Code2, Sparkles, Lightbulb, Smartphone, BarChart2]

export default function HomePage() {
  const { t } = useLang()
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetchPublishedProjects()
      .then(d => setProjects(d.filter(p => p.featured).slice(0, 3)))
      .catch(() => {})
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden hero-gradient">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              Paul Design & IT Solution
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
              <span className="gradient-text">{t.home.hero_title}</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
              {t.home.hero_subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/portfolio"
                id="cta-view-work"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:opacity-90 transition-all hover:gap-3"
              >
                {t.home.cta_primary}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                id="cta-contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-colors"
              >
                {t.home.cta_secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.home.services_heading}</h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.services.items.map((svc, i) => {
              const Icon = SERVICE_ICONS[i] || Globe
              return (
                <div
                  key={svc.title}
                  className="group p-6 rounded-2xl bg-card border border-border card-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{svc.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{svc.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">{t.home.featured_heading}</h2>
                <div className="w-16 h-1 bg-primary rounded-full" />
              </div>
              <Link
                to="/portfolio"
                className="text-sm font-semibold text-primary hover:underline hidden sm:flex items-center gap-1"
              >
                {t.home.view_all} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map(p => (
                <Link
                  key={p.id}
                  to={`/portfolio/${p.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-card border border-border card-hover"
                >
                  <div className="aspect-video bg-muted overflow-hidden">
                    {p.image_url
                      ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center">
                          <Palette className="w-8 h-8 text-primary/40" />
                        </div>
                    }
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{p.category}</span>
                    <h3 className="font-bold mt-2 mb-1 group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{truncate(p.description, 100)}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link to="/portfolio" className="text-sm font-semibold text-primary hover:underline">
                {t.home.view_all} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to build something great?</h2>
          <p className="text-white/80 mb-8 text-lg">Let's collaborate and turn your vision into reality.</p>
          <Link
            to="/contact"
            id="cta-banner-contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-purple-700 font-bold text-sm hover:bg-white/90 transition shadow-xl"
          >
            {t.home.cta_secondary} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
