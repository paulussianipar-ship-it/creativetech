import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchContent, fetchSettings } from '../lib/api';
import { useStoreSync } from '../lib/useStoreSync';

export default function Footer() {
  const [settings, setSettings] = useState(null);
  const [contact, setContact] = useState(null);

  const load = useCallback(async () => {
    const [settingsResult, contactResult] = await Promise.all([
      fetchSettings(),
      fetchContent('contact'),
    ]);
    if (settingsResult.data) setSettings(settingsResult.data);
    if (contactResult.data && contactResult.data.values) setContact(contactResult.data.values);
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useStoreSync(load);

  const siteName = settings?.siteName || 'Paul Design & IT Solution';
  const tagline = settings?.tagline || 'Creative Designer & IT Specialist. Menyediakan layanan pembuatan website, UI/UX, desain grafis, editing multimedia, dan solusi IT terpadu.';
  const email = contact?.email || 'paulussianipar@gmail.com';
  const whatsapp = contact?.whatsapp || '+62 85162744708';
  const address = contact?.address || 'Bekasi, Jawa Barat, Indonesia';

  return (
    <footer className="bg-[#0b0f19] border-t border-white/10 py-12 mt-auto">
      <div className="container mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-6">
              <img 
                src="/assets/images/logo.jpe" 
                alt={siteName}
                style={{ 
                  height: '40px', 
                  width: 'auto', 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0px 0px 4px rgba(255, 255, 255, 1))' 
                }} 
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {tagline}
            </p>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fa-brands fa-github text-xl"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fa-brands fa-linkedin text-xl"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fa-brands fa-instagram text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Layanan Kami</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li><Link to="/project/creative-design" className="hover:text-primary transition-colors">Creative Design</Link></li>
              <li><Link to="/project/multimedia" className="hover:text-primary transition-colors">Multimedia</Link></li>
              <li><Link to="/project/it-solution" className="hover:text-primary transition-colors">IT Consultant</Link></li>
              <li><Link to="/project/web-development" className="hover:text-primary transition-colors">Web Development</Link></li>
              <li><Link to="/project/cctv-specialist" className="hover:text-primary transition-colors">CCTV Specialist</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Perusahaan</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-primary transition-colors">Tentang Kami</Link></li>
              <li><Link to="/project" className="hover:text-primary transition-colors">Portofolio</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Kontak</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Hubungi Kami</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-location-dot mt-1 text-primary"></i>
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-envelope text-primary"></i>
                <a href={`mailto:${email}`} className="hover:text-primary transition-colors">{email}</a>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-brands fa-whatsapp text-primary"></i>
                <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">{whatsapp}</a>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="#" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
