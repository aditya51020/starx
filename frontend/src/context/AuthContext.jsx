import { createContext, useContext, useState, useEffect } from 'react';
import api from '../axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get('/api/auth/check-auth');
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (password) => {
    await api.post('/api/auth/login', { password });
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);