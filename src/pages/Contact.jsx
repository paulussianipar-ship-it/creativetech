import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { fetchContent, submitContactMessage } from '../lib/api';
import { useStoreSync } from '../lib/useStoreSync';

export default function Contact() {
  const [topic, setTopic] = useState('Pengembangan Web / App');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [content, setContent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const { data } = await fetchContent('contact');
    if (data && data.values) setContent(data.values);
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useStoreSync(load);

  const handleTopicClick = (selectedTopic) => {
    setTopic(selectedTopic);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const { error } = await submitContactMessage({
      name: formData.name,
      email: formData.email,
      topic,
      message: formData.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Pesan Anda berhasil dikirim ke sistem kami!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <div className="container">
        <h1 className="page-banner-title">Hubungi <span className="gradient-text">Saya</span></h1>
        <p className="page-banner-subtitle">
          Siap berdiskusi mengenai proyek baru, konsultasi arsitektur IT &amp; Creative Design, atau penawaran kerjasama profesional.
        </p>
        <div className="breadcrumb">
          <a href="/">Home</a>
          <i className="fa-solid fa-angle-right" style={{ margin: '0 10px' }}></i>
          <span className="current">Contact</span>
        </div>
      </div>

      <section className="contact-section" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div className="container">
          {/* Contact Status Bar Banner */}
          <div className="contact-status-bar glass-card">
            <div className="status-indicator">
              <span className="status-pulse-dot"></span>
              <span>Available for Freelance Projects &amp; Full-time Roles</span>
            </div>
            <div className="response-time-tag">
              <i className="fa-solid fa-bolt" style={{ color: 'var(--amber, #f59e0b)' }}></i> Respon Cepat (Maksimal 1x24 Jam)
            </div>
          </div>

          {/* Contact Grid (Left: Info Panel | Right: Interactive Form) */}
          <div className="contact-grid">
            
            {/* LEFT COLUMN: Modern Info Panel & WhatsApp Action */}
            <div className="contact-info-column">
              <div className="glass-card contact-info-panel" style={{ padding: '32px' }}>
                <div className="contact-panel-header">
                  <div className="contact-panel-badge">
                    <i className="fa-solid fa-address-card"></i> Direct Contact
                  </div>
                  <h3 className="contact-panel-title">Informasi &amp; Saluran Kontak</h3>
                  <p className="contact-panel-desc">
                    Silakan hubungi Paulus melalui saluran komunikasi di bawah ini atau isi formulir di samping untuk respon cepat.
                  </p>
                </div>

                <div className="contact-cards-list">
                  {/* Item 1 */}
                  <div className="contact-card-modern">
                    <div className="contact-icon icon-purple">
                      <i className="fa-solid fa-id-card"></i>
                    </div>
                    <div className="contact-details">
                      <span className="contact-card-label">Nama Lengkap &amp; Profesi</span>
                      <h4 className="contact-card-value">Paulus Petrus P Sianipar</h4>
                      <span className="sub-text">Creative Designer &amp; IT Specialist</span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="contact-card-modern">
                    <div className="contact-icon icon-red">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div className="contact-details">
                      <span className="contact-card-label">Alamat Studio / Domisili</span>
                      <h4 className="contact-card-value">{content?.address || 'Bekasi, Jawa Barat, Indonesia'}</h4>
                      <span className="sub-text">Tersedia untuk Kerja Remote &amp; Hybrid</span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="contact-card-modern">
                    <div className="contact-icon icon-emerald">
                      <i className="fa-brands fa-whatsapp"></i>
                    </div>
                    <div className="contact-details">
                      <span className="contact-card-label">No. Handphone / WhatsApp Direct</span>
                      <h4 className="contact-card-value"><a href={`https://wa.me/${(content?.whatsapp || '6285162744708').replace(/\D/g, '')}`} target="_blank" rel="noreferrer">{content?.whatsapp || '+62 85162744708 (WA Only)'}</a></h4>
                      <span className="sub-text" style={{ color: 'var(--emerald, #10b981)', fontWeight: 500 }}>● Online Chat via WhatsApp</span>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="contact-card-modern">
                    <div className="contact-icon icon-cyan">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div className="contact-details">
                      <span className="contact-card-label">Email Resmi Studio</span>
                      <h4 className="contact-card-value"><a href={`mailto:${content?.email || 'paulussianipar@gmail.com'}`}>{content?.email || 'paulussianipar@gmail.com'}</a></h4>
                      <span className="sub-text">Kirimkan rincian proyek / proposal</span>
                    </div>
                  </div>

                  {/* Item 5 */}
                  <div className="contact-card-modern">
                    <div className="contact-icon icon-amber">
                      <i className="fa-solid fa-clock"></i>
                    </div>
                    <div className="contact-details">
                      <span className="contact-card-label">Jam Operasional &amp; Respon</span>
                      <h4 className="contact-card-value">Senin - Sabtu: 08:00 - 20:00 WIB</h4>
                      <span className="sub-text">Respon pesan masuk &lt; 2 jam</span>
                    </div>
                  </div>
                </div>

                <a href={`https://wa.me/${(content?.whatsapp || '6285162744708').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="btn btn-emerald w-100 whatsapp-cta-btn">
                  <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.3rem' }}></i>
                  <span>Chat Direct via WhatsApp</span>
                  <i className="fa-solid fa-arrow-right icon-arrow"></i>
                </a>

                <div className="social-connect-box">
                  <h5 className="social-box-title">Media Sosial &amp; Network:</h5>
                  <div className="social-links-pills">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="social-pill-btn"><i className="fa-brands fa-github"></i> GitHub</a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-pill-btn"><i className="fa-brands fa-linkedin-in"></i> LinkedIn</a>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-pill-btn"><i className="fa-brands fa-twitter"></i> Twitter</a>
                    <a href="https://dribbble.com" target="_blank" rel="noreferrer" className="social-pill-btn"><i className="fa-brands fa-dribbble"></i> Dribbble</a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-pill-btn"><i className="fa-brands fa-instagram"></i> Instagram</a>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Modern Interactive Form Card */}
            <div className="glass-card form-wrapper-modern">
              <div className="form-header-badge">
                <span className="badge-quick-tag"><i className="fa-solid fa-paper-plane"></i> Kirim Pesan</span>
                <h3 className="form-title-modern">Kirim Pesan Langsung</h3>
                <p className="form-subtitle-modern">
                  Isi formulir di bawah ini untuk mengirim pesan. Kami akan membalas pesan Anda sesegera mungkin.
                </p>
              </div>

              <div className="topic-selector-wrap">
                <label className="topic-label">Pilih Kategori Kebutuhan Proyek:</label>
                <div className="topic-chips" id="topicChips">
                  <button type="button" className={`topic-chip ${topic === 'Pengembangan Web / App' ? 'active' : ''}`} onClick={() => handleTopicClick('Pengembangan Web / App')}>
                    <i className="fa-solid fa-code"></i> Web &amp; App
                  </button>
                  <button type="button" className={`topic-chip ${topic === 'Desain Kreatif & UI/UX' ? 'active' : ''}`} onClick={() => handleTopicClick('Desain Kreatif & UI/UX')}>
                    <i className="fa-solid fa-palette"></i> UI/UX &amp; Design
                  </button>
                  <button type="button" className={`topic-chip ${topic === 'Konsultasi IT & Arsitektur' ? 'active' : ''}`} onClick={() => handleTopicClick('Konsultasi IT & Arsitektur')}>
                    <i className="fa-solid fa-gears"></i> IT Consulting
                  </button>
                  <button type="button" className={`topic-chip ${topic === 'Kerja Sama / Hiring' ? 'active' : ''}`} onClick={() => handleTopicClick('Kerja Sama / Hiring')}>
                    <i className="fa-solid fa-briefcase"></i> Hiring / Other
                  </button>
                </div>
              </div>

              <form id="contactForm" className="contact-form" onSubmit={handleFormSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Nama Lengkap <span className="required-star">*</span></label>
                    <div className="input-icon-wrapper">
                      <i className="fa-solid fa-user input-icon"></i>
                      <input type="text" id="name" className="form-input" placeholder="Masukkan nama Anda" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Alamat Email <span className="required-star">*</span></label>
                    <div className="input-icon-wrapper">
                      <i className="fa-solid fa-envelope input-icon"></i>
                      <input type="email" id="email" className="form-input" placeholder="nama@domain.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subjek / Topik <span className="required-star">*</span></label>
                  <div className="input-icon-wrapper">
                    <i className="fa-solid fa-tag input-icon"></i>
                    <input type="text" id="subject" className="form-input" value={topic} readOnly required />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Pesan Anda <span className="required-star">*</span></label>
                  <div className="input-icon-wrapper">
                    <i className="fa-solid fa-message input-icon icon-top"></i>
                    <textarea id="message" className="form-input form-textarea" rows="5" placeholder="Tuliskan detail kebutuhan proyek atau pertanyaan Anda di sini..." required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                  </div>
                </div>

                <button type="submit" className="btn btn-emerald btn-lg btn-block submit-btn-modern" disabled={submitting}>
                  <i className={`fa-solid ${submitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i> {submitting ? 'Mengirim...' : 'Submit Pesan'}
                </button>
                
                <div className="form-privacy-note">
                  <i className="fa-solid fa-shield-halved" style={{ color: 'var(--emerald, #10b981)' }}></i>
                  <span>Informasi Anda dijamin aman &amp; tidak pernah disebarluaskan.</span>
                </div>
              </form>
            </div>
          </div>

          {/* Google Maps Location Section */}
          <div className="glass-card maps-container-wrapper" style={{ marginTop: '50px' }}>
            <div className="maps-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
              <div className="maps-title-info" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div className="contact-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--brand-primary)', border: '1px solid rgba(244, 63, 94, 0.3)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-map-location-dot"></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Lokasi Studio &amp; Peta Google Maps</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>Clarista Promosi, Jawa Barat, Indonesia</p>
                </div>
              </div>
              <a href="https://www.google.com/maps/place/Clarista+Promosi/" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                <i className="fa-solid fa-arrow-up-right-from-square"></i> Buka Google Maps
              </a>
            </div>

            <div className="maps-wrapper" style={{ height: '360px', overflow: 'hidden' }}>
              <iframe src={content?.mapUrl || "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15863.599745942689!2d106.9366402!3d-6.2768852!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698d125bf98c8d%3A0x97a7268772a6e067!2sClarista%20Promosi!5e0!3m2!1sen!2sid!4v1790405655792!5m2!1sen!2sid"} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Google Maps Location Clarista Promosi">
              </iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
