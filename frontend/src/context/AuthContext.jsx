import { createContext, useContext, useState } from 'react';
import apiClient from '../lib/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Store the safe user profile plus token so the app can fall back to bearer auth
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
    } catch (err) {
      console.error('Failed to parse user session', err);
      localStorage.removeItem('user');
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.post('/api/auth/login', { email, password });
      // data contains: { _id, name, email, role, token }
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'student') => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.post('/api/auth/register', { name, email, password, role });
      // Same as login — safe user info plus token for bearer fallback
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Tell the server to clear the httpOnly cookie
      await apiClient.post('/api/auth/logout');
    } catch {
      // Even if the server call fails, still clear local state
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

