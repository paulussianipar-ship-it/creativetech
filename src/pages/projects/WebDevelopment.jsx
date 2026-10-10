import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../../lib/api';
import { useStoreSync } from '../../lib/useStoreSync';

const SERVICES = [
  { icon: 'fa-globe',         title: 'Company Website',        desc: 'Website perusahaan profesional, company profile online, dan landing page yang konversi tinggi.' },
  { icon: 'fa-cart-shopping', title: 'Toko Online / E-Commerce', desc: 'Platform e-commerce lengkap dengan keranjang belanja, payment gateway, dan manajemen produk.' },
  { icon: 'fa-table-columns', title: 'Admin Dashboard',        desc: 'Dashboard admin dinamis dengan CMS, laporan, dan manajemen konten yang mudah digunakan.' },
  { icon: 'fa-server',        title: 'Web Hosting & Domain',   desc: 'Layanan hosting yang cepat dan handal, registrasi domain, dan pengelolaan server.' },
  { icon: 'fa-magnifying-glass', title: 'SEO & Optimasi',      desc: 'Optimasi mesin pencari, peningkatan kecepatan loading, dan audit performa website.' },
  { icon: 'fa-mobile-screen', title: 'Responsive Design',      desc: 'Website responsif yang tampil sempurna di semua perangkat: desktop, tablet, maupun mobile.' },
];

const TOOLS = ['React', 'Next.js', 'Laravel', 'PHP', 'JavaScript', 'MySQL', 'Tailwind CSS', 'Node.js'];

export default function WebDevelopment() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await fetchProjects({ category: 'web', status: 'published', pageSize: 20 });
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
        <h1 className="page-banner-title"><span className="gradient-text">Web Development</span></h1>
        <p className="page-banner-subtitle">
          Pengembangan website dan aplikasi web responsif yang cepat, aman, serta SEO-friendly — dari landing page hingga sistem enterprise.
        </p>
        <div className="breadcrumb">
          <a href="/">Home</a>
          <i className="fa-solid fa-angle-right" style={{ margin: '0 10px' }}></i>
          <a href="/project">Project</a>
          <i className="fa-solid fa-angle-right" style={{ margin: '0 10px' }}></i>
          <span className="current">Web Development</span>
        </div>
      </div>

      <main>
        <section style={{ paddingTop: '40px', paddingBottom: '80px' }}>
          <div className="container">

            <div className="section-title-wrap text-center" style={{ marginBottom: '3rem' }}>
              <span className="section-subtitle" style={{ color: 'var(--brand-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Layanan Tersedia</span>
              <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Layanan Web Development Kami</h2>
              <p style={{ color: '#6b7280', maxWidth: '500px', margin: '0 auto' }}>
                Website modern, cepat, dan scalable untuk mendukung pertumbuhan bisnis Anda secara digital.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
              {SERVICES.map(s => (
                <div key={s.title} className="glass-card" style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
                  <div style={{ fontSize: '1.75rem', color: 'var(--brand-primary)', marginBottom: '0.75rem' }}>
                    <i className={`fa-solid ${s.icon}`}></i>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="glass-card" style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '4rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}><i className="fa-solid fa-code" style={{ color: 'var(--brand-primary)', marginRight: '0.5rem' }}></i>Tech Stack</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {TOOLS.map(t => (
                  <span key={t} className="tag" style={{ background: 'var(--brand-primary)', color: 'white', padding: '0.35rem 0.9rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>

            <div className="section-title-wrap" style={{ marginBottom: '2rem' }}>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Proyek Web Development</h2>
            </div>

            {loading && (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#6b7280' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}></i>
                Memuat proyek...
              </div>
            )}

            {!loading && projects.length === 0 && (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderRadius: '1rem' }}>
                <i className="fa-solid fa-code" style={{ fontSize: '3rem', color: 'var(--brand-primary)', marginBottom: '1rem', display: 'block' }}></i>
                <h3 style={{ marginBottom: '0.5rem' }}>Segera Hadir</h3>
                <p style={{ color: '#6b7280' }}>Portofolio Web Development sedang disiapkan. Hubungi kami untuk konsultasi lebih lanjut.</p>
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
