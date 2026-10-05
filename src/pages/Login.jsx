import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isRegister) {
      // Simulate registration
      alert('Pendaftaran berhasil! Silakan login.');
      setIsRegister(false); // Switch to login view
      return;
    }
    
    // Auto-determine role based on email for demo purposes
    let role = 'user';
    if (email.toLowerCase().includes('admin')) {
      role = 'admin';
    } else if (email.toLowerCase().includes('designer')) {
      role = 'designer';
    }
    
    // Simulate login/register and set role in localStorage
    localStorage.setItem('userRole', role);
    navigate('/dashboard');
  };

  return (
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="card auth-container" style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem', borderRadius: '1rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            type="button" 
            onClick={() => setIsRegister(false)}
            style={{ flex: 1, padding: '0.5rem', background: !isRegister ? 'var(--primary)' : 'transparent', color: !isRegister ? 'white' : 'inherit', border: '1px solid var(--primary)', borderRadius: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            Login
          </button>
          <button 
            type="button" 
            onClick={() => setIsRegister(true)}
            style={{ flex: 1, padding: '0.5rem', background: isRegister ? 'var(--primary)' : 'transparent', color: isRegister ? 'white' : 'inherit', border: '1px solid var(--primary)', borderRadius: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            Register
          </button>
        </div>

        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          {isRegister ? 'Buat Akun Baru' : 'Masuk ke Workspace'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Nama Lengkap</label>
              <input type="text" placeholder="John Doe" required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }} />
            </div>
          )}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
            <input 
              type="email" 
              placeholder="email@contoh.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }} 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
            <input type="password" placeholder="••••••••" required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }} />
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 'bold' }}>
            {isRegister ? 'Daftar Akun' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
