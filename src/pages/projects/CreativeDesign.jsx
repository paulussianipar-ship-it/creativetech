import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../../lib/api';
import { useStoreSync } from '../../lib/useStoreSync';

const SERVICES = [
  { icon: 'fa-id-card',   title: 'Brand Identity',         desc: 'Pembuatan logo, panduan merek, dan identitas visual yang konsisten dan berkesan.' },
  { icon: 'fa-print',     title: 'Desain Cetak',           desc: 'Brosur, flyer, poster, banner, kartu nama, dan semua materi cetak profesional.' },
  { icon: 'fa-mobile',    title: 'Konten Digital & Sosmed', desc: 'Feed Instagram, story, thumbnail YouTube, dan konten media sosial berformat premium.' },
  { icon: 'fa-book-open', title: 'Company Profile',        desc: 'Company profile cetak dan digital, annual report, dan presentasi korporat.' },
  { icon: 'fa-shirt',     title: 'Merchandise',            desc: 'Desain kaos, merchandise, packaging, dan produk branded lainnya.' },
  { icon: 'fa-image',     title: 'Ilustrasi & Vektor',     desc: 'Ilustrasi custom, karakter, infografis, dan artwork vektor berkualitas tinggi.' },
];

const TOOLS = ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign', 'Canva', 'CorelDRAW', 'Figma'];

export default function CreativeDesign() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await fetchProjects({ category: 'design', status: 'published', pageSize: 20 });
    setProjects(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useStoreSync(load);

  return (
    <>
      <div className="container">
        <h1 className="page-banner-title"><span className="gradient-text">Creative Design</span></h1>
        <p className="page-banner-subtitle">
          Layanan desain grafis profesional untuk membangun identitas visual merek yang kuat, berkesan, dan konsisten.
        </p>
        <div className="breadcrumb">
          <a href="/">Home</a>
          <i className="fa-solid fa-angle-right" style={{ margin: '0 10px' }}></i>
          <a href="/project">Project</a>
          <i className="fa-solid fa-angle-right" style={{ margin: '0 10px' }}></i>
          <span className="current">Creative Design</span>
        </div>
      </div>

      <main>
        <section style={{ paddingTop: '40px', paddingBottom: '80px' }}>
          <div className="container">

            {/* Services Grid */}
            <div className="section-title-wrap text-center" style={{ marginBottom: '3rem' }}>
              <span className="section-subtitle" style={{ color: 'var(--brand-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Layanan Tersedia</span>
              <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Apa yang Kami Tawarkan</h2>
              <p style={{ color: '#6b7280', maxWidth: '500px', margin: '0 auto' }}>
                Dari logo hingga media sosial, kami hadir untuk semua kebutuhan desain visual Anda.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
              {SERVICES.map(s => (
                <div key={s.title} className="glass-card" style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)', background: 'var(--surface-color)', transition: 'transform 0.3s' }}>
                  <div style={{ fontSize: '1.75rem', color: 'var(--brand-primary)', marginBottom: '0.75rem' }}>
                    <i className={`fa-solid ${s.icon}`}></i>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Tools */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '4rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}><i className="fa-solid fa-screwdriver-wrench" style={{ color: 'var(--brand-primary)', marginRight: '0.5rem' }}></i>Tools yang Digunakan</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {TOOLS.map(t => (
                  <span key={t} className="tag" style={{ background: 'var(--brand-primary)', color: 'white', padding: '0.35rem 0.9rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Projects from API */}
            <div className="section-title-wrap" style={{ marginBottom: '2rem' }}>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Proyek Creative Design</h2>
            </div>

            {loading && (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#6b7280' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}></i>
                Memuat proyek...
              </div>
            )}

            {!loading && projects.length === 0 && (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderRadius: '1rem' }}>
                <i className="fa-solid fa-palette" style={{ fontSize: '3rem', color: 'var(--brand-primary)', marginBottom: '1rem', display: 'block' }}></i>
                <h3 style={{ marginBottom: '0.5rem' }}>Segera Hadir</h3>
                <p style={{ color: '#6b7280' }}>Portofolio Creative Design sedang disiapkan. Hubungi kami untuk konsultasi lebih lanjut.</p>
                <Link to="/contact" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none' }}>
                  <i className="fa-solid fa-comments"></i> Konsultasi Sekarang
                </Link>
              </div>
            )}

            {!loading && projects.length > 0 && (
              <div className="projects-grid">
                {projects.map(p => (
                  <Link
                    key={p.id}
                    to={p.slug ? `/project/${p.slug}` : '/project'}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    <article className="glass-card project-card">
                      {p.image_url && (
                        <div className="project-img-box">
                          <img src={p.image_url} alt={p.title} loading="lazy" />
                        </div>
                      )}
                      <div className="project-body">
                        <h3 className="project-title">{p.title}</h3>
                        {p.client && <p style={{ color: 'var(--brand-primary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}><i className="fa-solid fa-building"></i> {p.client}</p>}
                        <p className="project-snippet">{p.description}</p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

          </div>
        </section>
      </main>
    </>
  );
}
