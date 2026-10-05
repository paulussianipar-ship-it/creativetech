import { useState } from 'react';

export default function Project() {
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    {
      id: 'cd000001-0000-4000-8000-000000000001',
      category: 'Creative Design',
      img: '/assets/images/slides/slide1.jpg',
      title: 'Creative Design',
      desc: 'Desain identitas visual, branding, dan materi promosi yang konsisten untuk membangun citra merek yang kuat dan mudah diingat.',
      tags: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign', 'Canva']
    },
    {
      id: 'cd000002-0000-4000-8000-000000000002',
      category: 'Multimedia',
      img: '/assets/images/slides/slide2.jpg',
      title: 'Multimedia',
      desc: 'Produksi konten multimedia interaktif: video promosi, motion graphic, animasi 3D, serta konten sosial media yang relevan untuk berbagai platform.',
      tags: ['Adobe Premiere Pro', 'Adobe After Effects', 'DaVinci Resolve', 'Blender']
    },
    {
      id: 'cd000003-0000-4000-8000-000000000003',
      category: 'IT Consultant',
      img: '/assets/images/slides/slide3.jpg',
      title: 'IT Consultant',
      desc: 'Konsultasi teknologi menyeluruh mulai dari audit infrastruktur, perancangan arsitektur, hingga migrasi aplikasi legacy ke stack modern.',
      tags: ['IT Infrastructure Audit', 'Cloud Architecture', 'Docker', 'Linux']
    },
    {
      id: 'cd000004-0000-4000-8000-000000000004',
      category: 'Web Development',
      img: '/assets/images/image1.png',
      title: 'Web Development',
      desc: 'Pengembangan website dan aplikasi web responsif yang cepat, aman, serta SEO-friendly, dari landing page hingga dashboard dinamis dengan CMS.',
      tags: ['JavaScript', 'PHP', 'Laravel', 'MySQL']
    },
    {
      id: 'cd000005-0000-4000-8000-000000000005',
      category: 'CCTV Specialist',
      img: '/assets/images/image2.png',
      title: 'CCTV Specialist',
      desc: 'Instalasi dan konfigurasi sistem CCTV untuk keamanan rumah, ruko, maupun kantor, termasuk perekaman jarak jauh dan akses tampilan real-time.',
      tags: ['IP Camera', 'NVR Setup', 'CCTV Remote Viewing', 'Network Cabling']
    }
  ];

  const filteredProjects = activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter);

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
              <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>Semua Proyek (5)</button>
              <button className={`filter-btn ${activeFilter === 'Creative Design' ? 'active' : ''}`} onClick={() => setActiveFilter('Creative Design')}>Creative Design</button>
              <button className={`filter-btn ${activeFilter === 'Multimedia' ? 'active' : ''}`} onClick={() => setActiveFilter('Multimedia')}>Multimedia</button>
              <button className={`filter-btn ${activeFilter === 'IT Consultant' ? 'active' : ''}`} onClick={() => setActiveFilter('IT Consultant')}>IT Consultant</button>
              <button className={`filter-btn ${activeFilter === 'Web Development' ? 'active' : ''}`} onClick={() => setActiveFilter('Web Development')}>Web Development</button>
              <button className={`filter-btn ${activeFilter === 'CCTV Specialist' ? 'active' : ''}`} onClick={() => setActiveFilter('CCTV Specialist')}>CCTV Specialist</button>
            </div>

            {/* Projects Cards Grid */}
            <div className="projects-grid" id="projectsGrid">
              {filteredProjects.map((project) => (
                <article key={project.id} className="glass-card project-card" data-category={project.category} tabIndex="0" role="button" aria-label={`Lihat detail ${project.category}`}>
                  <div className="project-img-box">
                    <img src={project.img} alt={project.category} loading="lazy" />
                    <span className="project-badge">{project.category}</span>
                    <div className="project-overlay">
                      <span className="btn btn-primary btn-sm">
                        <i className="fa-solid fa-expand"></i> Detail Proyek
                      </span>
                    </div>
                  </div>
                  <div className="project-body">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-snippet">{project.desc}</p>
                    <div className="project-tags">
                      {project.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
