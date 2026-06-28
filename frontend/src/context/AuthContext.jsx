import { createContext, useState, useEffect, useContext } from 'react';
import axios from '../axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
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
          // Fetch full user details to get wishlist if role is user
          if (res.data.user.role === 'user') {
            const meRes = await axios.get('/api/auth/me');
            const dbWishlist = meRes.data.user?.wishlist || [];
            setWishlist(dbWishlist);
            localStorage.setItem('wishlist', JSON.stringify(dbWishlist));
          } else {
            setWishlist([]);
          }
        } else {
          setUser(null);
          // Load local wishlist for guest
          const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
          setWishlist(saved);
        }
      } catch (err) {
        setUser(null);
        const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlist(saved);
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
      const dbWishlist = res.data.user?.wishlist || [];
      setWishlist(dbWishlist);
      localStorage.setItem('wishlist', JSON.stringify(dbWishlist));
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
    setWishlist([]);
    return { success: true };
  };

  const signup = async (name, email, password) => {
    const res = await axios.post('/api/auth/signup', { name, email, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    setUser(res.data.user);
    const dbWishlist = res.data.user?.wishlist || [];
    setWishlist(dbWishlist);
    localStorage.setItem('wishlist', JSON.stringify(dbWishlist));
    return { success: true };
  };

  const logout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
    setWishlist([]);
    localStorage.removeItem('wishlist');
    localStorage.removeItem('token');
  };

  const toggleWishlist = async (propertyId) => {
    const isSaved = wishlist.includes(propertyId);
    const newWishlist = isSaved
      ? wishlist.filter(id => id !== propertyId)
      : [...wishlist, propertyId];

    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));

    if (user && user.role === 'user') {
      try {
        await axios.post('/api/auth/wishlist', { wishlist: newWishlist });
      } catch (err) {
        console.error('Failed to sync wishlist with server:', err);
      }
    }
  };

  const clearWishlist = async () => {
    setWishlist([]);
    localStorage.removeItem('wishlist');
    if (user && user.role === 'user') {
      try {
        await axios.post('/api/auth/wishlist', { wishlist: [] });
      } catch (err) {
        console.error('Failed to clear wishlist on server:', err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, wishlist, toggleWishlist, clearWishlist, login, adminLogin, signup, logout, loading }}>
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