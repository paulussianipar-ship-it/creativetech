import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProjectBySlug } from '../lib/api';
import { useStoreSync } from '../lib/useStoreSync';

const CATEGORY_LABELS = {
  design: 'Creative Design',
  media: 'Multimedia',
  it: 'IT Consultant',
  web: 'Web Development',
  security: 'CCTV Specialist',
  other: 'Lainnya',
};

const CATEGORY_ROUTES = {
  design: '/project/creative-design',
  media: '/project/multimedia',
  it: '/project/it-solution',
  web: '/project/web-development',
  security: '/project/cctv-specialist',
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await fetchProjectBySlug(slug);
    if (error || !data) {
      setProject(null);
      setNotFound(true);
    } else {
      setProject(data);
      setNotFound(false);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);
  useStoreSync(load);

  const categoryLabel = project ? CATEGORY_LABELS[project.category] || 'Portofolio' : '';
  const categoryRoute = project ? CATEGORY_ROUTES[project.category] || '/project' : '/project';
  const gallery = Array.isArray(project?.images)
    ? project.images.map((img) => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: '#6b7280' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}></i>
        Memuat detail proyek...
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <i className="fa-solid fa-folder-open" style={{ fontSize: '3rem', color: 'var(--brand-primary)', marginBottom: '1rem', display: 'block' }}></i>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Proyek tidak ditemukan</h1>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Proyek yang Anda cari mungkin sudah dipindahkan atau belum dipublikasikan.
        </p>
        <Link to="/project" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
          <i className="fa-solid fa-arrow-left"></i> Kembali ke Portofolio
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <h1 className="page-banner-title">{project.title}</h1>
        {project.client && (
          <p className="page-banner-subtitle">
            <i className="fa-solid fa-building" style={{ marginRight: '0.5rem' }}></i>
            Klien: <strong>{project.client}</strong>
          </p>
        )}
        <div className="breadcrumb">
          <a href="/">Home</a>
          <i className="fa-solid fa-angle-right" style={{ margin: '0 10px' }}></i>
          <Link to="/project" style={{ color: 'inherit' }}>Project</Link>
          <i className="fa-solid fa-angle-right" style={{ margin: '0 10px' }}></i>
          <Link to={categoryRoute} style={{ color: 'inherit' }}>{categoryLabel}</Link>
          <i className="fa-solid fa-angle-right" style={{ margin: '0 10px' }}></i>
          <span className="current">{project.title}</span>
        </div>
      </div>

      <main>
        <section style={{ paddingTop: '40px', paddingBottom: '80px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
              {/* Cover */}
              <div className="glass-card" style={{ overflow: 'hidden', borderRadius: '1rem', padding: 0 }}>
                {project.image_url || gallery[0] ? (
                  <img
                    src={project.image_url || gallery[0]}
                    alt={project.title}
                    style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: '460px' }}
                  />
                ) : (
                  <div style={{ padding: '5rem 2rem', textAlign: 'center', color: 'var(--brand-primary)' }}>
                    <i className="fa-solid fa-image" style={{ fontSize: '3.5rem' }}></i>
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <span
                  className="tag"
                  style={{ display: 'inline-block', background: 'var(--brand-primary)', color: 'white', padding: '0.35rem 0.9rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}
                >
                  {categoryLabel}
                </span>

                <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>{project.title}</h2>

                {project.description && (
                  <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: '1.5rem' }}>{project.description}</p>
                )}

                {project.content && (
                  <div
                    className="project-content"
                    style={{ color: 'var(--text-color)', lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: project.content }}
                  />
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem' }}>
                  <Link to="/contact" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
                    <i className="fa-solid fa-comments"></i> Diskusikan Proyek Serupa
                  </Link>
                  <Link to="/project" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <i className="fa-solid fa-arrow-left"></i> Semua Proyek
                  </Link>
                </div>
              </div>
            </div>

            {/* Gallery */}
            {gallery.length > 1 && (
              <div style={{ marginTop: '3.5rem' }}>
                <div className="section-title-wrap" style={{ marginBottom: '1.5rem' }}>
                  <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Galeri Proyek</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                  {gallery.map((src, index) => (
                    <a
                      key={`${src}-${index}`}
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className="glass-card"
                      style={{ overflow: 'hidden', borderRadius: '0.75rem', padding: 0, display: 'block' }}
                    >
                      <img src={src} alt={`${project.title} ${index + 1}`} loading="lazy" style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
