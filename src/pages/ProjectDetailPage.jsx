import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProjectBySlug } from '../lib/api'
import { formatDate } from '../lib/utils'
import { ArrowLeft, Calendar, User, Palette } from 'lucide-react'
import { useLang } from '../contexts/LangContext'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const { lang } = useLang()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchProjectBySlug(slug)
      .then(setProject)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-24 space-y-4">
      <div className="h-8 w-48 bg-muted rounded animate-pulse" />
      <div className="aspect-video bg-muted rounded-2xl animate-pulse" />
      <div className="h-6 w-2/3 bg-muted rounded animate-pulse" />
      <div className="h-4 w-full bg-muted rounded animate-pulse" />
    </div>
  )

  if (error || !project) return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <p className="text-muted-foreground mb-4">Project not found.</p>
      <Link to="/portfolio" className="text-primary hover:underline">← Back to Portfolio</Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Portfolio
      </Link>

      {/* Cover image */}
      <div className="aspect-video rounded-2xl overflow-hidden bg-muted mb-8">
        {project.image_url
          ? <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center">
              <Palette className="w-12 h-12 text-primary/40" />
            </div>
        }
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{project.category}</span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(project.created_at, lang === 'en' ? 'en-US' : 'id-ID')}
        </span>
        {project.client && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="w-3.5 h-3.5" />
            {project.client}
          </span>
        )}
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{project.title}</h1>
      {project.description && (
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{project.description}</p>
      )}

      {/* Rich content */}
      {project.content && (
        <div
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: project.content }}
        />
      )}

      {/* Gallery */}
      {project.images?.length > 1 && (
        <div className="mt-10">
          <h3 className="font-bold text-lg mb-4">Gallery</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {project.images.map((img) => (
              <a key={img.path} href={img.url} target="_blank" rel="noopener noreferrer" className="rounded-xl overflow-hidden aspect-video bg-muted block">
                <img src={img.url} alt={img.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
