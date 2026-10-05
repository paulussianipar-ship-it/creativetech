import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Demo credentials
const DEMO_USERS = [
  { id: 1, email: 'admin@creativestech.com', password: 'admin123', name: 'Admin Master', role: 'admin' },
  { id: 2, email: 'designer@creativestech.com', password: 'designer123', name: 'Jane Designer', role: 'designer' },
  { id: 3, email: 'user@creativestech.com', password: 'user123', name: 'John User', role: 'user' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ct_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('ct_user'); }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const found = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, message: 'Email atau password salah.' };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('ct_user', JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ct_user');
    // Also clear old key
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
