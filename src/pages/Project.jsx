import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../lib/api';
import { useStoreSync } from '../lib/useStoreSync';

// Mapping category key dari API ke label tampilan & route
const CATEGORY_MAP = {
  design:   { label: 'Creative Design',  route: '/project/creative-design',  icon: 'fa-palette',   img: '/assets/images/slides/slide1.jpg', tags: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign', 'Canva'] },
  media:    { label: 'Multimedia',        route: '/project/multimedia',        icon: 'fa-film',      img: '/assets/images/slides/slide2.jpg', tags: ['Adobe Premiere Pro', 'Adobe After Effects', 'DaVinci Resolve', 'Blender'] },
  it:       { label: 'IT Consultant',     route: '/project/it-solution',       icon: 'fa-headset',   img: '/assets/images/slides/slide3.jpg', tags: ['IT Infrastructure Audit', 'Cloud Architecture', 'Docker', 'Linux'] },
  web:      { label: 'Web Development',   route: '/project/web-development',   icon: 'fa-code',      img: '/assets/images/image1.png',        tags: ['JavaScript', 'PHP', 'Laravel', 'MySQL'] },
  security: { label: 'CCTV Specialist',   route: '/project/cctv-specialist',   icon: 'fa-video',     img: '/assets/images/image2.png',        tags: ['IP Camera', 'NVR Setup', 'CCTV Remote Viewing', 'Network Cabling'] },
};

const FILTER_CATEGORIES = [
  { key: 'all',      label: 'Semua Proyek' },
  { key: 'design',   label: 'Creative Design' },
  { key: 'media',    label: 'Multimedia' },
  { key: 'it',       label: 'IT Consultant' },
  { key: 'web',      label: 'Web Development' },
  { key: 'security', label: 'CCTV Specialist' },
];

const DEFAULT_PROJECTS = [
  { id: 'default-1', title: 'Creative Design', category: 'design',   description: 'Desain identitas visual, branding, dan materi promosi yang konsisten untuk membangun citra merek yang kuat dan mudah diingat.', image_url: null },
  { id: 'default-2', title: 'Multimedia',       category: 'media',    description: 'Produksi konten multimedia interaktif: video promosi, motion graphic, animasi 3D, serta konten sosial media.', image_url: null },
  { id: 'default-3', title: 'IT Consultant',    category: 'it',       description: 'Konsultasi teknologi menyeluruh mulai dari audit infrastruktur, perancangan arsitektur, hingga migrasi aplikasi.', image_url: null },
  { id: 'default-4', title: 'Web Development',  category: 'web',      description: 'Pengembangan website dan aplikasi web responsif yang cepat, aman, serta SEO-friendly.', image_url: null },
  { id: 'default-5', title: 'CCTV Specialist',  category: 'security', description: 'Instalasi dan konfigurasi sistem CCTV untuk keamanan rumah, ruko, maupun kantor.', image_url: null },
];

export default function Project() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await fetchProjects({ status: 'published', pageSize: 50 });
    if (data && data.length > 0) {
      setProjects(data);
    } else {
      setProjects(DEFAULT_PROJECTS);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useStoreSync(load);

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <>
      <div className="container">
        <h1 className="page-banner-title">Portofolio <span className="gradient-text">Proyek</span></h1>
        <p className="page-banner-subtitle">
          Koleksi karya terbaik meliputi Creative Design, Multimedia, IT Consultant, Web Development, CCTV Specialist
        </p>
        <div className="breadcrumb">
          <a href="/">Home</a>
          <i className="fa-solid fa-angle-right" style={{ margin: '0 10px' }}></i>
          <span className="current">Project</span>
        </div>
      </div>

      <main>
        <section className="projects-section" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
          <div className="container">
            {/* Category Filter Buttons */}
            <div className="filter-controls" id="projectFilters">
              {FILTER_CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  className={`filter-btn ${activeFilter === cat.key ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat.key)}
                >
                  {cat.label}{cat.key === 'all' && !loading ? ` (${projects.length})` : ''}
                </button>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}></i>
                Memuat proyek...
              </div>
            )}

            {/* Projects Cards Grid */}
            {!loading && (
              filteredProjects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
                  <i className="fa-solid fa-folder-open" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}></i>
                  <p>Belum ada proyek pada kategori ini.</p>
                </div>
              ) : (
                <div className="projects-grid" id="projectsGrid">
                  {filteredProjects.map((project) => {
                    const catInfo = CATEGORY_MAP[project.category] || CATEGORY_MAP['design'];
                    const imgSrc = project.image_url || (project.images && project.images[0]) || catInfo.img;
                    const tags = catInfo.tags;

                    return (
                      <Link
                        key={project.id}
                        to={project.slug ? `/project/${project.slug}` : catInfo.route}
                        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                      >
                        <article
                          className="glass-card project-card"
                          data-category={catInfo.label}
                          tabIndex="0"
                          role="article"
                          aria-label={`Lihat detail ${catInfo.label}`}
                        >
                          <div className="project-img-box">
                            <img src={imgSrc} alt={catInfo.label} loading="lazy" />
                            <span className="project-badge">{catInfo.label}</span>
                            <div className="project-overlay">
                              <span className="btn btn-primary btn-sm">
                                <i className="fa-solid fa-expand"></i> Detail Proyek
                              </span>
                            </div>
                          </div>
                          <div className="project-body">
                            <h3 className="project-title">{project.title}</h3>
                            <p className="project-snippet">{project.description}</p>
                            <div className="project-tags">
                              {tags.slice(0, 4).map(tag => (
                                <span key={tag} className="tag">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </section>
      </main>
    </>
  );
}
