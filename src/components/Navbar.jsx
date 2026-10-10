import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Menu, X, ChevronDown } from 'lucide-react';
import { fetchSettings } from '../lib/api';
import { useStoreSync } from '../lib/useStoreSync';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [siteName, setSiteName] = useState('Paul Design & IT Solution');

  const load = useCallback(async () => {
    const { data } = await fetchSettings();
    if (data?.siteName) setSiteName(data.siteName);
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useStoreSync(load);

  return (
    <nav className="sticky top-0 z-[100] bg-[#0b0f19cc] backdrop-blur-md border-b border-white/10 w-full">
      <div className="w-full flex flex-col md:flex-row items-center justify-between py-4 px-6 md:px-10">
        
        {/* Top Header: Logo (Left) and Mobile Toggle */}
        <div className="w-full md:w-auto flex justify-between items-center">
          
          <Link to="/" className="flex items-center">
            <img 
              src="/assets/images/logo.jpe" 
              alt={siteName}
              style={{ 
                height: '60px', // Dikecilkan sedikit dari 75px
                width: 'auto', 
                objectFit: 'contain',
                // List putih halus
                filter: 'drop-shadow(0px 0px 4px rgba(255, 255, 255, 1))' 
              }} 
            />
          </Link>
          
          {/* Hamburger Menu (Mobile Only) */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Navigation Links */}
        <div 
          className={`${
            isOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row gap-6 mt-6 md:mt-0 items-center w-full md:w-auto transition-all duration-300`}
        >
          <Link to="/" className="hover:text-primary transition-colors font-medium">Home</Link>
          <Link to="/about" className="hover:text-primary transition-colors font-medium">About</Link>
          <div className="relative group flex flex-col items-center">
            <Link to="/project" className="hover:text-primary transition-colors font-medium flex items-center gap-1">
              Project <ChevronDown size={16} className="hidden md:block" />
            </Link>
            
            {/* Dropdown Menu (Desktop) */}
            <div className="md:absolute md:top-full md:left-1/2 md:-translate-x-1/2 md:pt-4 md:opacity-0 md:invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-full md:w-56 hidden md:block">
              <div className="bg-[#1e293b] border border-white/10 rounded-lg shadow-xl overflow-hidden flex flex-col py-2">
                <Link to="/project/creative-design" className="px-4 py-2 hover:bg-primary/20 hover:text-primary transition-colors">Creative Design</Link>
                <Link to="/project/multimedia" className="px-4 py-2 hover:bg-primary/20 hover:text-primary transition-colors">Multimedia</Link>
                <Link to="/project/it-solution" className="px-4 py-2 hover:bg-primary/20 hover:text-primary transition-colors">IT Consultant</Link>
                <Link to="/project/web-development" className="px-4 py-2 hover:bg-primary/20 hover:text-primary transition-colors">Web Development</Link>
                <Link to="/project/cctv-specialist" className="px-4 py-2 hover:bg-primary/20 hover:text-primary transition-colors">CCTV Specialist</Link>
              </div>
            </div>

            {/* Submenu for Mobile */}
            <div className="flex flex-col items-center mt-2 space-y-2 md:hidden">
                <Link to="/project/creative-design" className="text-sm text-gray-300 hover:text-primary transition-colors">Creative Design</Link>
                <Link to="/project/multimedia" className="text-sm text-gray-300 hover:text-primary transition-colors">Multimedia</Link>
                <Link to="/project/it-solution" className="text-sm text-gray-300 hover:text-primary transition-colors">IT Consultant</Link>
                <Link to="/project/web-development" className="text-sm text-gray-300 hover:text-primary transition-colors">Web Development</Link>
                <Link to="/project/cctv-specialist" className="text-sm text-gray-300 hover:text-primary transition-colors">CCTV Specialist</Link>
            </div>
          </div>
          <Link to="/contact" className="hover:text-primary transition-colors font-medium">Contact</Link>
          
          <Link to="/login" className="btn btn-primary flex items-center gap-2 mt-2 md:mt-0 md:ml-4">
            <UserCircle size={20} />
            Login
          </Link>
        </div>
        
      </div>
    </nav>
  );
}
