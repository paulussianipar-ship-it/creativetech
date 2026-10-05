import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminPanel from '../components/AdminPanel';
import { LogOut, Shield, Lock, Eye, EyeOff, AlertCircle, LogIn, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── ADMIN LOGIN FORM ──────────────────────────────────────── */
function AdminLoginForm() {
  const { adminLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = adminLogin(email, password);
    setLoading(false);
    if (!result.success) setError(result.message);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 0 40px rgba(99,102,241,0.5)',
          }}>
            <Shield size={30} color="#fff" />
          </div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 22, margin: 0 }}>Admin Panel</h1>
          <p style={{ color: '#a5b4fc', fontSize: 14, marginTop: 6 }}>Masuk untuk mengelola website</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20,
          padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8,
              color: '#fca5a5', fontSize: 14, marginBottom: 18,
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#c4b5fd', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email Admin</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="admin@email.com"
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10,
                  border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)',
                  color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', color: '#c4b5fd', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  style={{
                    width: '100%', padding: '11px 42px 11px 14px', borderRadius: 10,
                    border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)',
                    color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 2,
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px 0',
              background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: loading ? 'none' : '0 4px 15px rgba(99,102,241,0.4)',
            }}>
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Memproses...
                </>
              ) : (
                <><LogIn size={18} /> Masuk</>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={14} /> Kembali ke Website
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #6b7280 !important; }
      `}</style>
    </div>
  );
}

/* ─── ADMIN DASHBOARD (after login) ─────────────────────────── */
function AdminDashboard() {
  const { admin, adminLogout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Admin Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
        padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '7px 9px', display: 'flex', alignItems: 'center' }}>
            <Shield size={20} color="#c4b5fd" />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>Admin Panel</div>
            <div style={{ color: '#a5b4fc', fontSize: 12 }}>Paul Design &amp; IT Solution</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 15,
            }}>A</div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{admin?.name}</div>
              <div style={{ background: '#7c3aed', color: '#e9d5ff', borderRadius: 999, padding: '1px 8px', fontSize: 11, fontWeight: 700, display: 'inline-block' }}>ADMIN</div>
            </div>
          </div>

          <Link to="/" style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#c4b5fd', borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
            fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
            textDecoration: 'none',
          }}>
            <ArrowLeft size={14} /> Website
          </Link>

          <button onClick={adminLogout} style={{
            background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5', borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
            fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.35)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '28px 20px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: 16, padding: '20px 24px', marginBottom: 24, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
        }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>👋 Selamat datang, {admin?.name}!</div>
            <div style={{ fontSize: 14, color: '#c4b5fd' }}>
              Kelola pengguna, project, dan konten website dari sini.
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 18px',
            textAlign: 'center', backdropFilter: 'blur(8px)',
          }}>
            <div style={{ fontSize: 11, color: '#c4b5fd', marginBottom: 2 }}>Akses Level</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>⚡ ADMIN</div>
          </div>
        </div>

        {/* Admin Panel CRUD */}
        <div style={{
          background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb',
          padding: '24px 22px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        }}>
          <AdminPanel />
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN EXPORT ────────────────────────────────────────────── */
export default function Admin() {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f0c29' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not logged in → show login form
  if (!admin) return <AdminLoginForm />;

  // Logged in as admin → show admin dashboard
  return <AdminDashboard />;
}
