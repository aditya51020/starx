import { createContext, useState, useEffect, useContext } from 'react';
import axios from '../axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/check-auth');
        if (res.data.isAuthenticated) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    // Try user login first
    try {
      const res = await axios.post('/api/auth/login/user', { email, password });
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  const adminLogin = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    setUser(res.data.user);
    return { success: true };
  };

  const signup = async (name, email, password) => {
    const res = await axios.post('/api/auth/signup', { name, email, password });
    setUser(res.data.user);
    return { success: true };
  };

  const logout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
    // Clear local storage items that might depend on user
    localStorage.removeItem('wishlist');
  };

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};