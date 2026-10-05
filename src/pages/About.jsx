export default function About() {
  return (
    <>
      <div className="container">
        <h1 className="page-banner-title">Tentang <span className="gradient-text">Kami</span></h1>
        <p className="page-banner-subtitle">
          Mengenal lebih dekat profil profesional kami, spesialisasi keahlian teknis, dan layanan IT & Design yang kami tawarkan.
        </p>
        <div className="breadcrumb">
          <a href="/">Home</a>
          <i className="fa-solid fa-angle-right" style={{ margin: '0 10px' }}></i>
          <span className="current">About</span>
        </div>
      </div>

      <main>
        <section className="about-section" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
          <div className="container">
            {/* Main About Grid (Profile Image + Biodata) */}
            <div className="about-grid">
              {/* Left Column: Portrait Photo with Glow */}
              <div className="about-image-wrapper">
                <div className="about-image-card">
                  <img src="/assets/images/profile.png" alt="Paulus Petrus P Sianipar" className="about-img" id="profileImage" />
                  <div className="about-image-badge"></div>
                </div>
              </div>

              {/* Right Column: Bio & Biodata Details */}
              <div className="about-details">
                {/* Biodata Grid Table (Positioned ON TOP) */}
                <div className="biodata-grid" style={{ marginBottom: '28px' }}>
                  <div className="biodata-item">
                    <span className="bio-label"><i className="fa-solid fa-id-card"></i> Nama Lengkap</span>
                    <span className="bio-value">Paulus Petrus P Sianipar</span>
                  </div>
                  <div className="biodata-item">
                    <span className="bio-label"><i className="fa-solid fa-user-gear"></i> Profesi</span>
                    <span className="bio-value">Creative Designer &amp; IT</span>
                  </div>
                  <div className="biodata-item">
                    <span className="bio-label"><i className="fa-solid fa-location-dot"></i> Lokasi</span>
                    <span className="bio-value">Bekasi, Jawa Barat, Indonesia</span>
                  </div>
                  <div className="biodata-item">
                    <span className="bio-label"><i className="fa-solid fa-envelope"></i> Email</span>
                    <span className="bio-value">paulussianipar@gmail.com</span>
                  </div>
                  <div className="biodata-item">
                    <span className="bio-label"><i className="fa-solid fa-phone"></i> No. Handphone / WA</span>
                    <span className="bio-value">+62 85162744708 (WA Only)</span>
                  </div>
                  <div className="biodata-item">
                    <span className="bio-label"><i className="fa-solid fa-circle-check" style={{ color: 'var(--emerald, #10b981)' }}></i> Status Freelance</span>
                    <span className="bio-value text-emerald" style={{ color: 'var(--emerald, #10b981)' }}>Available</span>
                  </div>
                </div>

                {/* Profile Heading & Description Text (Positioned BELOW) */}
                <h3 className="about-heading">
                  Creative Designer &amp; IT Specialist
                </h3>
                <p className="about-text">
                  Saya memfokuskan karir profesional saya untuk membantu perusahaan dan pemangku kepentingan membangun
                  produk digital berskala industri. Berbekal pemahaman arsitektur perangkat lunak yang matang serta dorongan
                  estetika visual, saya percaya setiap karya desain dan baris kode harus berdampak langsung pada kecepatan,
                  kenyamanan, dan kepuasan pengguna.
                </p>

                {/* Action Buttons Group */}
                <div style={{ marginTop: '28px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>

                  <a href="/contact" className="btn btn-outline">
                    <i className="fa-solid fa-comments"></i> Diskusi Proyek
                  </a>
                </div>
              </div>
            </div>

            {/* Technical Skills Bar Section */}
            <div style={{ marginTop: '70px' }}>
              <div className="section-title-wrap text-center">
                <span className="section-subtitle">Keahlian Utama</span>
                <h2 className="section-title">Skill &amp; Spesialisasi</h2>
              </div>

              <div className="skills-grid">
                {/* Skill 1: Creative Design */}
                <div className="glass-card skill-card">
                  <div className="skill-header">
                    <div className="skill-name-wrap">
                      <div className="skill-icon-box">
                        <i className="fa-solid fa-palette" style={{ color: '#38bdf8' }}></i>
                      </div>
                      <div className="skill-title-group">
                        <h4 className="skill-name">Creative Design</h4>
                        <p className="skill-subtext">Adobe Illustrator, Photoshop, Premiere, Canva, InDesign</p>
                      </div>
                    </div>
                    <div className="skill-percentage">95%</div>
                  </div>
                  <div className="skill-bar-bg">
                    <div className="skill-bar-fill" style={{ width: '95%' }}></div>
                  </div>
                </div>

                {/* Skill 2: Multimedia */}
                <div className="glass-card skill-card">
                  <div className="skill-header">
                    <div className="skill-name-wrap">
                      <div className="skill-icon-box">
                        <i className="fa-brands fa-laravel" style={{ color: '#ff2d20' }}></i>
                      </div>
                      <div className="skill-title-group">
                        <h4 className="skill-name">Multimedia</h4>
                        <p className="skill-subtext">Photoshoot, Videoshoot, Photo Editing, Video Editing</p>
                      </div>
                    </div>
                    <div className="skill-percentage">90%</div>
                  </div>
                  <div className="skill-bar-bg">
                    <div className="skill-bar-fill" style={{ width: '90%' }}></div>
                  </div>
                </div>

                {/* Skill 3: IT Consultant */}
                <div className="glass-card skill-card">
                  <div className="skill-header">
                    <div className="skill-name-wrap">
                      <div className="skill-icon-box">
                        <i className="fa-solid fa-database" style={{ color: '#06b6d4' }}></i>
                      </div>
                      <div className="skill-title-group">
                        <h4 className="skill-name">IT Consultant</h4>
                        <p className="skill-subtext">Networking, Maintenance, Installation, Repair</p>
                      </div>
                    </div>
                    <div className="skill-percentage">80%</div>
                  </div>
                  <div className="skill-bar-bg">
                    <div className="skill-bar-fill" style={{ width: '80%' }}></div>
                  </div>
                </div>

                {/* Skill 4: Web Development */}
                <div className="glass-card skill-card">
                  <div className="skill-header">
                    <div className="skill-name-wrap">
                      <div className="skill-icon-box">
                        <i className="fa-brands fa-figma" style={{ color: '#a855f7' }}></i>
                      </div>
                      <div className="skill-title-group">
                        <h4 className="skill-name">Web Development</h4>
                        <p className="skill-subtext">Web Develop, Web Hosting, Domain</p>
                      </div>
                    </div>
                    <div className="skill-percentage">75%</div>
                  </div>
                  <div className="skill-bar-bg">
                    <div className="skill-bar-fill" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                {/* Skill 5: CCTV Specialist */}
                <div className="glass-card skill-card">
                  <div className="skill-header">
                    <div className="skill-name-wrap">
                      <div className="skill-icon-box">
                        <i className="fa-solid fa-video" style={{ color: '#f59e0b' }}></i>
                      </div>
                      <div className="skill-title-group">
                        <h4 className="skill-name">CCTV Specialist</h4>
                        <p className="skill-subtext">Instalasi, Setting</p>
                      </div>
                    </div>
                    <div className="skill-percentage">80%</div>
                  </div>
                  <div className="skill-bar-bg">
                    <div className="skill-bar-fill" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
