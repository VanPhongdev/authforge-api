import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) { setLoading(false); return; }
    try {
      const res = await api.get('/users/profile');
      setUser(res.data);
    } catch {
      localStorage.clear();
      setUser(null);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    const decoded = parseJwt(data.accessToken);
    setUser({ ...decoded, email: credentials.email });
    await loadUser();
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refreshToken');
      if (refresh) await api.post('/auth/logout', { token: refresh });
    } catch { /* ignore */ }
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
