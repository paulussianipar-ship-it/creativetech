import React from 'react';

export default function WebDevelopment() {
  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '80vh' }}>
      <h1 className="page-banner-title"><span className="gradient-text">Web Development</span></h1>
      <p className="page-banner-subtitle">
        Halaman ini masih dalam tahap pengembangan (Placeholder).
      </p>
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
        <i className="fa-solid fa-code" style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Segera Hadir</h2>
        <p style={{ color: 'var(--text-muted)' }}>Portofolio lengkap untuk layanan Web Development akan ditampilkan di sini.</p>
      </div>
    </div>
  );
}
