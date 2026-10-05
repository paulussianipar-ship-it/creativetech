import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminPanel from '../components/AdminPanel';
import { LogOut, Shield } from 'lucide-react';

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Admin Header Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 10,
            padding: '7px 9px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Shield size={20} color="#c4b5fd" />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>
              Admin Panel
            </div>
            <div style={{ color: '#a5b4fc', fontSize: 12 }}>
              Paul Design &amp; IT Solution
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* User info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 15,
            }}>
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div style={{ display: 'none' }} className="sm-show">
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{
                background: '#7c3aed', color: '#e9d5ff',
                borderRadius: 999, padding: '1px 8px', fontSize: 11, fontWeight: 700,
                display: 'inline-block',
              }}>
                {user?.role?.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(239,68,68,0.2)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5',
              borderRadius: 8,
              padding: '7px 14px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '28px 20px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: 16,
          padding: '20px 24px',
          marginBottom: 24,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
        }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
              👋 Selamat datang, {user?.name}!
            </div>
            <div style={{ fontSize: 14, color: '#c4b5fd' }}>
              Anda login sebagai <strong style={{ color: '#e9d5ff' }}>Administrator</strong> — kelola semua konten, pengguna, dan project website di sini.
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: '10px 18px',
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ fontSize: 11, color: '#c4b5fd', marginBottom: 2 }}>Akses Level</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>⚡ ADMIN</div>
          </div>
        </div>

        {/* Admin Panel */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          padding: '24px 22px',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        }}>
          <AdminPanel />
        </div>
      </div>
    </div>
  );
}
