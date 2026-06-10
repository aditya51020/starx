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
          if (res.data.token) {
            localStorage.setItem('token', res.data.token);
          }
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
    try {
      const res = await axios.post('/api/auth/login/user', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  const adminLogin = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    setUser(res.data.user);
    return { success: true };
  };

  const signup = async (name, email, password) => {
    const res = await axios.post('/api/auth/signup', { name, email, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    setUser(res.data.user);
    return { success: true };
  };

  const logout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
    // Clear local storage items that might depend on user
    localStorage.removeItem('wishlist');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, signup, logout, loading }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};