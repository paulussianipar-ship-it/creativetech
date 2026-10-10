import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Home,
  Info,
  FolderKanban,
  Phone,
  ChevronDown,
  ChevronUp,
  Pencil,
  X,
  Palette,
  Film,
  Headphones,
  Code2,
  Video,
  LogOut,
  Shield,
} from 'lucide-react';

const PROJECT_ITEMS = [
  { label: 'Creative Design', route: '/project/creative-design', adminPath: '/admin/projects', icon: <Palette size={13} />, category: 'design' },
  { label: 'Multimedia',       route: '/project/multimedia',        adminPath: '/admin/projects', icon: <Film size={13} />,    category: 'media' },
  { label: 'IT Consultant',    route: '/project/it-solution',       adminPath: '/admin/projects', icon: <Headphones size={13} />, category: 'it' },
  { label: 'Web Development',  route: '/project/web-development',   adminPath: '/admin/projects', icon: <Code2 size={13} />,  category: 'web' },
  { label: 'CCTV Specialist',  route: '/project/cctv-specialist',   adminPath: '/admin/projects', icon: <Video size={13} />,  category: 'security' },
];

const NAV_ITEMS = [
  { label: 'Home',    route: '/',        adminPath: '/admin/content', icon: <Home size={14} />,        sub: null },
  { label: 'About',   route: '/about',   adminPath: '/admin/content', icon: <Info size={14} />,        sub: null },
  { label: 'Project', route: '/project', adminPath: '/admin/projects', icon: <FolderKanban size={14} />, sub: PROJECT_ITEMS },
  { label: 'Contact', route: '/contact', adminPath: '/admin/content', icon: <Phone size={14} />,       sub: null },
];

export default function AdminBar() {
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);

  // Hanya tampil di halaman publik untuk admin/editor
  if (!isAdmin) return null;
  if (location.pathname.startsWith('/admin')) return null;

  async function handleLogout() {
    await signOut();
    navigate('/');
  }

  if (collapsed) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '80px',
          right: '12px',
          zIndex: 9999,
        }}
      >
        <button
          onClick={() => setCollapsed(false)}
          title="Buka Admin Bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(99,102,241,0.5)',
          }}
        >
          <Shield size={14} />
          Admin
          <ChevronDown size={13} />
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '12px',
        zIndex: 9999,
        background: 'rgba(15, 20, 35, 0.97)',
        border: '1px solid rgba(99,102,241,0.35)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(99,102,241,0.15)',
        backdropFilter: 'blur(16px)',
        minWidth: '220px',
        overflow: 'hidden',
        fontFamily: 'inherit',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))',
          borderBottom: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <Shield size={14} style={{ color: '#818cf8' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#c7d2fe', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Admin Bar
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '10px', color: '#6b7280', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name?.split(' ')[0]}
          </span>
          <button
            onClick={() => setCollapsed(true)}
            style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '2px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
            title="Sembunyikan"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Dashboard shortcut */}
      <div style={{ padding: '8px 10px 4px' }}>
        <Link
          to="/admin/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 10px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'white',
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            marginBottom: '6px',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <LayoutDashboard size={13} />
          Buka Admin Panel
        </Link>

        {/* Divider label */}
        <p style={{ fontSize: '9px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600, margin: '6px 4px 4px' }}>
          Edit Halaman
        </p>

        {/* Nav items */}
        {NAV_ITEMS.map(item => (
          <div key={item.label}>
            {item.sub ? (
              /* Project — expandable */
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: '7px',
                    fontSize: '12px',
                    color: '#d1d5db',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <span style={{ color: '#818cf8' }}>{item.icon}</span>
                    <Link to={item.route} style={{ color: 'inherit', textDecoration: 'none', flex: 1 }}>
                      {item.label}
                    </Link>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Link
                      to={item.adminPath}
                      title={`Edit ${item.label}`}
                      style={{ color: '#6366f1', display: 'flex', padding: '2px 4px', borderRadius: '4px', textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Pencil size={11} />
                    </Link>
                    <button
                      onClick={() => setProjectOpen(v => !v)}
                      style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                    >
                      {projectOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>
                </div>

                {projectOpen && (
                  <div style={{ paddingLeft: '18px', paddingBottom: '2px' }}>
                    {item.sub.map(sub => (
                      <div
                        key={sub.label}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderRadius: '6px', marginBottom: '1px', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#6b7280' }}>{sub.icon}</span>
                          <Link to={sub.route} style={{ fontSize: '11px', color: '#9ca3af', textDecoration: 'none' }}>
                            {sub.label}
                          </Link>
                        </div>
                        <Link
                          to={`${sub.adminPath}?category=${sub.category}`}
                          title={`Kelola ${sub.label}`}
                          style={{ color: '#6366f1', display: 'flex', padding: '2px 4px', borderRadius: '4px', textDecoration: 'none', fontSize: '10px' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <Pencil size={10} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Regular nav item */
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  borderRadius: '7px',
                  marginBottom: '1px',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <span style={{ color: '#818cf8' }}>{item.icon}</span>
                  <Link to={item.route} style={{ fontSize: '12px', color: '#d1d5db', textDecoration: 'none', flex: 1 }}>
                    {item.label}
                  </Link>
                </div>
                <Link
                  to={item.adminPath}
                  title={`Edit ${item.label}`}
                  style={{ color: '#6366f1', display: 'flex', padding: '2px 5px', borderRadius: '4px', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Pencil size={11} />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '6px 10px 10px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '4px' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '6px 10px',
            borderRadius: '7px',
            fontSize: '11px',
            color: '#f87171',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s',
            textAlign: 'left',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={12} />
          Keluar dari Admin
        </button>
      </div>
    </div>
  );
}
