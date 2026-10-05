import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Lock, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate brief loading
    await new Promise(r => setTimeout(r, 600));

    const result = login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Redirect based on role
    if (result.user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const DEMO_ACCOUNTS = [
    { label: 'Admin', email: 'admin@creativestech.com', password: 'admin123', color: '#7c3aed', icon: '🛡️' },
    { label: 'Designer', email: 'designer@creativestech.com', password: 'designer123', color: '#2563eb', icon: '🎨' },
    { label: 'User', email: 'user@creativestech.com', password: 'user123', color: '#16a34a', icon: '👤' },
  ];

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 16px 40px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 0 30px rgba(99,102,241,0.5)',
          }}>
            <Shield size={28} color="#fff" />
          </div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 24, margin: 0 }}>Masuk ke Workspace</h1>
          <p style={{ color: '#a5b4fc', fontSize: 14, marginTop: 6 }}>Paul Design &amp; IT Solution</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
          padding: '28px 28px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          {/* Error */}
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
              <label style={{ display: 'block', color: '#c4b5fd', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="email@contoh.com"
                  style={{
                    width: '100%', padding: '11px 12px 11px 38px',
                    borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.08)', color: '#fff',
                    fontSize: 14, outline: 'none', boxSizing: 'border-box',
                    transition: 'border 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', color: '#c4b5fd', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '11px 40px 11px 38px',
                    borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.08)', color: '#fff',
                    fontSize: 14, outline: 'none', boxSizing: 'border-box',
                    transition: 'border 0.2s',
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

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px 0',
                background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', border: 'none', borderRadius: 10,
                fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: loading ? 'none' : '0 4px 15px rgba(99,102,241,0.4)',
                transition: 'all 0.2s',
              }}>
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Memproses...
                </>
              ) : (
                <><LogIn size={18} /> Login</>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div style={{ marginTop: 22 }}>
            <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 12, marginBottom: 10 }}>
              ── Demo Akun ──
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {DEMO_ACCOUNTS.map(acc => (
                <button key={acc.label} onClick={() => fillDemo(acc)} style={{
                  flex: 1, padding: '8px 6px', borderRadius: 8,
                  border: `1px solid ${acc.color}40`,
                  background: `${acc.color}15`, color: '#e5e7eb',
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  transition: 'all 0.2s', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 16 }}>{acc.icon}</div>
                  <div style={{ color: acc.color === '#7c3aed' ? '#c4b5fd' : acc.color === '#2563eb' ? '#93c5fd' : '#86efac' }}>{acc.label}</div>
                </button>
              ))}
            </div>
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 11, marginTop: 8 }}>
              Klik salah satu untuk isi otomatis, lalu klik Login
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 13, marginTop: 20 }}>
          <Link to="/" style={{ color: '#a5b4fc', textDecoration: 'none' }}>← Kembali ke Website</Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #6b7280 !important; }
      `}</style>
    </div>
  );
}
