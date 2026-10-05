import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, Menu, X, ChevronDown, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-[100] bg-[#0b0f19cc] backdrop-blur-md border-b border-white/10 w-full">
      <div className="w-full flex flex-col md:flex-row items-center justify-between py-4 px-6 md:px-10">
        
        {/* Top Header: Logo (Left) and Mobile Toggle */}
        <div className="w-full md:w-auto flex justify-between items-center">
          
          <Link to="/" className="flex items-center">
            <img 
              src="/assets/images/logo.png" 
              alt="Paul Design & IT Solution" 
              style={{ 
                height: '60px',
                width: 'auto', 
                objectFit: 'contain',
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
          <Link to="/" className="hover:text-primary transition-colors font-medium" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/about" className="hover:text-primary transition-colors font-medium" onClick={() => setIsOpen(false)}>About</Link>
          <div className="relative group flex flex-col items-center">
            <Link to="/project" className="hover:text-primary transition-colors font-medium flex items-center gap-1" onClick={() => setIsOpen(false)}>
              Project <ChevronDown size={16} className="hidden md:block" />
            </Link>
            
            {/* Dropdown Menu (Desktop) */}
            <div className="md:absolute md:top-full md:left-1/2 md:-translate-x-1/2 md:pt-4 md:opacity-0 md:invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-full md:w-56 hidden md:block">
              <div className="bg-[#1e293b] border border-white/10 rounded-lg shadow-xl overflow-hidden flex flex-col py-2">
                <Link to="/project/creative-design" className="px-4 py-2 hover:bg-primary/20 hover:text-primary transition-colors">Creative Design</Link>
                <Link to="/project/multimedia" className="px-4 py-2 hover:bg-primary/20 hover:text-primary transition-colors">Multimedia</Link>
                <Link to="/project/it-solution" className="px-4 py-2 hover:bg-primary/20 hover:text-primary transition-colors">IT Solution</Link>
                <Link to="/project/web-development" className="px-4 py-2 hover:bg-primary/20 hover:text-primary transition-colors">Web Development</Link>
                <Link to="/project/cctv-specialist" className="px-4 py-2 hover:bg-primary/20 hover:text-primary transition-colors">CCTV Specialist</Link>
              </div>
            </div>

            {/* Submenu for Mobile */}
            <div className="flex flex-col items-center mt-2 space-y-2 md:hidden">
                <Link to="/project/creative-design" className="text-sm text-gray-300 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Creative Design</Link>
                <Link to="/project/multimedia" className="text-sm text-gray-300 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Multimedia</Link>
                <Link to="/project/it-solution" className="text-sm text-gray-300 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>IT Solution</Link>
                <Link to="/project/web-development" className="text-sm text-gray-300 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Web Development</Link>
                <Link to="/project/cctv-specialist" className="text-sm text-gray-300 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>CCTV Specialist</Link>
            </div>
          </div>
          <Link to="/contact" className="hover:text-primary transition-colors font-medium" onClick={() => setIsOpen(false)}>Contact</Link>
          
          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-3 mt-2 md:mt-0 md:ml-4">
              {/* User badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
                }}>
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{user.name}</div>
                  <div style={{ color: '#a5b4fc', fontSize: 11 }}>{user.role}</div>
                </div>
              </div>

              {/* Admin Panel link if admin */}
              {user.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-1" style={{
                  background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.5)',
                  color: '#c4b5fd', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 600,
                  textDecoration: 'none',
                }} onClick={() => setIsOpen(false)}>
                  <Shield size={14} /> Admin
                </Link>
              )}

              {user.role !== 'admin' && (
                <Link to="/dashboard" style={{
                  background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
                  color: '#a5b4fc', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 600,
                  textDecoration: 'none',
                }} onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              )}

              <button onClick={handleLogout} style={{
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5', borderRadius: 8, padding: '6px 10px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13,
              }}>
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary flex items-center gap-2 mt-2 md:mt-0 md:ml-4" onClick={() => setIsOpen(false)}>
              <UserCircle size={20} />
              Login
            </Link>
          )}
        </div>
        
      </div>
    </nav>
  );
}
