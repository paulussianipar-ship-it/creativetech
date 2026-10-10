import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2, Lock, LogIn } from 'lucide-react';

export default function Login() {
  const { signIn, user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Bila sudah login, arahkan ke tempat yang sesuai
  if (!loading && user) {
    const from = location.state?.from;
    return <Navigate to={from || (isAdmin ? '/admin' : '/dashboard')} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    if (isRegister) {
      toast.info('Pendaftaran publik belum tersedia. Silakan hubungi admin.');
      return;
    }

    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error || 'Login gagal. Periksa email dan password Anda.');
      return;
    }

    toast.success('Selamat datang kembali!');
    // Redirect sesuai role — ditentukan di Navigate di atas saat re-render
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--border-color)',
    background: 'rgba(255,255,255,0.05)',
    color: 'var(--text-color)',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Card */}
        <div style={{
          background: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '1.25rem',
          padding: '2.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        }}>

          {/* Icon */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '56px', height: '56px', borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--brand-primary), #8b5cf6)',
              marginBottom: '1rem',
            }}>
              <Lock size={24} color="white" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              {isRegister ? 'Buat Akun Baru' : 'Masuk ke Sistem'}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              {isRegister
                ? 'Isi data untuk mendaftar sebagai anggota'
                : 'Selamat datang! Silakan masuk ke akun Anda.'}
            </p>
          </div>

          {/* Tab */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', padding: '4px' }}>
            {['Login', 'Register'].map((tab, i) => (
              <button
                key={tab}
                type="button"
                onClick={() => setIsRegister(i === 1)}
                style={{
                  flex: 1, padding: '0.5rem', border: 'none', borderRadius: '0.6rem',
                  background: (isRegister ? i === 1 : i === 0) ? 'var(--brand-primary)' : 'transparent',
                  color: (isRegister ? i === 1 : i === 0) ? 'white' : '#6b7280',
                  fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >{tab}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isRegister && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 500 }}>Nama Lengkap</label>
                <input
                  type="text" placeholder="Nama Anda" required
                  value={name} onChange={e => setName(e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
              <input
                type="email" placeholder="email@contoh.com" required
                value={email} onChange={e => setEmail(e.target.value)}
                autoComplete="username"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••" required
                  value={password} onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ ...inputStyle, paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                width: '100%', padding: '0.8rem', borderRadius: '0.65rem', border: 'none',
                background: submitting ? '#6b7280' : 'linear-gradient(135deg, var(--brand-primary), #8b5cf6)',
                color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s', marginTop: '0.25rem',
              }}
            >
              {submitting
                ? <><Loader2 size={16} className="animate-spin" /> Memproses...</>
                : <><LogIn size={16} /> {isRegister ? 'Daftar Akun' : 'Masuk'}</>
              }
            </button>
          </form>

          {!isRegister && (
            <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: '#6b7280' }}>
              Admin dapat masuk langsung dari sini.{' '}
              <Link to="/contact" style={{ color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 500 }}>
                Butuh bantuan?
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

