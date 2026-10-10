import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchContent } from '../lib/api';
import { useStoreSync } from '../lib/useStoreSync';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [content, setContent] = useState(null);
  const slides = [
    "./assets/images/slides/slide1.jpg",
    "./assets/images/slides/slide2.jpg",
    "./assets/images/slides/slide3.jpg"
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const load = useCallback(async () => {
    const { data } = await fetchContent('home');
    if (data && data.values) setContent(data.values);
  }, []);

  useEffect(() => { load(); }, [load]);
  useStoreSync(load);

  return (
    <div className="home-page-wrapper">
      <div className="container hero-container" style={{ padding: '40px 0 80px', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
        {/* Hero Text Column */}
        <div className="hero-content" style={{ flex: '1 1 400px' }}>
          <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-color)', padding: '0.5rem 1rem', borderRadius: '2rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <span className="badge-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
            <span>Available for Freelance & Senior Engineering Roles</span>
          </div>

          <h1 className="hero-title" style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.5rem' }}>
            {content?.heroTitle || (
              <>
                Membangun Solusi Digital <br />
                <span className="gradient-text" style={{ background: 'linear-gradient(to right, var(--brand-primary), #8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Eksklusif & Skalabel</span>
              </>
            )}
          </h1>

          <div className="hero-subtitle" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 500 }}>
            Halo! Saya Paulus, seorang <span id="typewriter" className="typewriter-text text-primary">IT Consultant</span>
          </div>

          <p className="hero-description" style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            {content?.heroSubtitle || 'Menggabungkan keahlian mendalam pada pengembangan Creative Design & Full-Stack Web, arsitektur cloud performa tinggi, serta estetika UI/UX modern untuk menciptakan pengalaman digital terbaik.'}
          </p>

          <div className="hero-cta-group" style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <Link to="/project" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold' }}>
              <i className="fa-solid fa-layer-group" style={{ marginRight: '0.5rem' }}></i> {content?.heroButton || 'Lihat Portofolio Proyek'}
            </Link>
            <Link to="/about" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: '1px solid var(--border-color)' }}>
              <i className="fa-solid fa-user-gear" style={{ marginRight: '0.5rem' }}></i> Tentang Saya
            </Link>
          </div>

          {/* Hero Stat Counters */}
          <div className="hero-stats" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div className="stat-item">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                <span className="stat-number" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-color)' }}>34</span>
                <span className="stat-plus" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>+</span>
              </div>
              <div className="stat-label" style={{ fontSize: '0.875rem', color: '#6b7280' }}>Proyek Selesai</div>
            </div>
            <div className="stat-divider" style={{ width: '1px', height: '40px', background: 'var(--border-color)' }}></div>
            <div className="stat-item">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                <span className="stat-number" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-color)' }}>5</span>
                <span className="stat-plus" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>+</span>
              </div>
              <div className="stat-label" style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tahun Pengalaman</div>
            </div>
            <div className="stat-divider" style={{ width: '1px', height: '40px', background: 'var(--border-color)' }}></div>
            <div className="stat-item">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                <span className="stat-number" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-color)' }}>99</span>
                <span className="stat-plus" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>%</span>
              </div>
              <div className="stat-label" style={{ fontSize: '0.875rem', color: '#6b7280' }}>Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Hero Visual (Creative Design, Multimedia Design & IT) */}
        <div className="hero-visual" style={{ flex: '1 1 400px', position: 'relative' }}>
          <figure className="hero-art-card" id="heroSlider" style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div className="hero-slides" style={{ position: 'relative', height: '500px' }}>
              {slides.map((src, index) => (
                <img 
                  key={index}
                  src={src} 
                  width="1600" 
                  height="1600" 
                  className={`hero-slide ${index === currentSlide ? 'is-active' : ''}`} 
                  alt={`Karya Paulus Petrus P Sianipar - Slide ${index + 1}`} 
                  loading={index === 0 ? 'eager' : 'lazy'}
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    opacity: index === currentSlide ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out'
                  }}
                />
              ))}
            </div>

            <button onClick={prevSlide} className="hero-slide-btn hero-slide-prev" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', border: 'none', cursor: 'pointer', zIndex: 10 }}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button onClick={nextSlide} className="hero-slide-btn hero-slide-next" style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', border: 'none', cursor: 'pointer', zIndex: 10 }}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>

            <div className="hero-slide-dots" style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
              {slides.map((_, index) => (
                <button 
                  key={index}
                  type="button" 
                  onClick={() => setCurrentSlide(index)}
                  className={`hero-slide-dot ${index === currentSlide ? 'active' : ''}`} 
                  style={{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', cursor: 'pointer', background: index === currentSlide ? 'var(--brand-primary)' : 'rgba(255,255,255,0.5)' }}
                ></button>
              ))}
            </div>

            <figcaption className="hero-art-overlay" style={{ position: 'absolute', bottom: '3.5rem', left: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', zIndex: 10 }}>
              <Link to="/project" className="hero-art-tag" style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', backdropFilter: 'blur(4px)' }}>
                <i className="fa-solid fa-palette"></i> Creative Design
              </Link>
              <Link to="/project" className="hero-art-tag" style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', backdropFilter: 'blur(4px)' }}>
                <i className="fa-solid fa-film"></i> Multimedia
              </Link>
              <Link to="/project" className="hero-art-tag" style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', backdropFilter: 'blur(4px)' }}>
                <i className="fa-solid fa-headset"></i> IT Consultant
              </Link>
              <Link to="/project" className="hero-art-tag" style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', backdropFilter: 'blur(4px)' }}>
                <i className="fa-solid fa-code"></i> Web Development
              </Link>
              <Link to="/project" className="hero-art-tag" style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', backdropFilter: 'blur(4px)' }}>
                <i className="fa-solid fa-video"></i> CCTV Specialist
              </Link>
            </figcaption>
          </figure>
        </div>
      </div>

      <section className="home-teasers" style={{ padding: '80px 0', background: 'var(--bg-color)' }}>
        <div className="container">
          <div className="section-title-wrap text-center" style={{ marginBottom: '3rem' }}>
            <span className="section-subtitle" style={{ color: 'var(--brand-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Eksplorasi Portfolio</span>
            <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Halaman & Layanan Utama</h2>
            {content?.aboutTeaser ? (
              <div className="section-description" style={{ margin: '0 auto', maxWidth: '600px', color: '#6b7280' }} dangerouslySetInnerHTML={{ __html: content.aboutTeaser }} />
            ) : (
              <p className="section-description" style={{ margin: '0 auto', maxWidth: '600px', color: '#6b7280' }}>
                Jelajahi halaman lengkap kami untuk melihat profil, proyek terbaru, serta informasi kontak dan lokasi studio.
              </p>
            )}
          </div>

          <div className="home-teaser-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Card 1: About */}
            <div className="glass-card teaser-card" style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', background: 'var(--surface-color)', transition: 'transform 0.3s' }}>
              <div className="teaser-icon" style={{ fontSize: '2rem', color: 'var(--brand-primary)', marginBottom: '1rem' }}>
                <i className="fa-solid fa-user-gear"></i>
              </div>
              <h3 className="teaser-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Tentang Saya (About)</h3>
              <p className="teaser-desc" style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Pelajari latar belakang profesional, profil perusahaan, rekam jejak, serta layanan kami.
              </p>
              <Link to="/about" className="btn btn-outline btn-sm" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--brand-primary)', color: 'var(--brand-primary)', textDecoration: 'none' }}>
                Buka Halaman About <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>

            {/* Card 2: Projects */}
            <div className="glass-card teaser-card" style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', background: 'var(--surface-color)', transition: 'transform 0.3s' }}>
              <div className="teaser-icon" style={{ fontSize: '2rem', color: 'var(--brand-primary)', marginBottom: '1rem' }}>
                <i className="fa-solid fa-cubes"></i>
              </div>
              <h3 className="teaser-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Portofolio Proyek (Project)</h3>
              <p className="teaser-desc" style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Temukan koleksi proyek Web App, Mobile App, dan UI/UX Design modern lengkap dengan filter kategori & modal
                lightbox detail.
              </p>
              <Link to="/project" className="btn btn-outline btn-sm" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--brand-primary)', color: 'var(--brand-primary)', textDecoration: 'none' }}>
                Buka Halaman Project <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>

            {/* Card 3: Contact */}
            <div className="glass-card teaser-card" style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', background: 'var(--surface-color)', transition: 'transform 0.3s' }}>
              <div className="teaser-icon" style={{ fontSize: '2rem', color: 'var(--brand-primary)', marginBottom: '1rem' }}>
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <h3 className="teaser-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Kontak & Lokasi (Contact)</h3>
              <p className="teaser-desc" style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Hubungi Paul via formulir pesan, nomor WhatsApp, email, serta lihat lokasi studio secara presisi pada
                Google Maps interaktif.
              </p>
              <Link to="/contact" className="btn btn-outline btn-sm" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--brand-primary)', color: 'var(--brand-primary)', textDecoration: 'none' }}>
                Buka Halaman Contact <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
