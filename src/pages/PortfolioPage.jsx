import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../contexts/LangContext'
import { fetchPublishedProjects } from '../lib/api'
import { truncate } from '../lib/utils'
import { ArrowRight, Palette } from 'lucide-react'

export default function PortfolioPage() {
  const { t } = useLang()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchPublishedProjects()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categories = ['all', ...new Set(projects.map(p => p.category))]
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-14">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 gradient-text">{t.portfolio.title}</h1>
        <p className="text-lg text-muted-foreground">{t.portfolio.subtitle}</p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              filter === cat
                ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                : 'border-border hover:bg-muted'
            }`}
          >
            {cat === 'all' ? t.portfolio.all : cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-muted animate-pulse aspect-[4/3]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">{t.portfolio.empty}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <Link
              key={p.id}
              to={`/portfolio/${p.slug}`}
              className="group block rounded-2xl overflow-hidden bg-card border border-border card-hover"
            >
              <div className="aspect-video bg-muted overflow-hidden relative">
                {p.image_url
                  ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center">
                      <Palette className="w-8 h-8 text-primary/40" />
                    </div>
                }
                {p.featured && (
                  <span className="absolute top-3 left-3 text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">★ Featured</span>
                )}
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{p.category}</span>
                <h2 className="font-bold text-lg mt-2 mb-1 group-hover:text-primary transition-colors">{p.title}</h2>
                <p className="text-sm text-muted-foreground mb-3">{truncate(p.description, 100)}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  {t.portfolio.view_project} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
