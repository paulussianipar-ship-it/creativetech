import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Admin credentials (hardcoded for static site)
const ADMIN_EMAIL = 'admin@creativestech.com';
const ADMIN_PASSWORD = 'admin123';

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ct_admin');
    if (stored) {
      try { setAdmin(JSON.parse(stored)); } catch { localStorage.removeItem('ct_admin'); }
    }
    setLoading(false);
  }, []);

  const adminLogin = (email, password) => {
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = { name: 'Administrator', email: ADMIN_EMAIL, role: 'admin' };
      setAdmin(adminUser);
      localStorage.setItem('ct_admin', JSON.stringify(adminUser));
      return { success: true };
    }
    return { success: false, message: 'Email atau password admin salah.' };
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('ct_admin');
  };

  return (
    <AuthContext.Provider value={{ admin, adminLogin, adminLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
