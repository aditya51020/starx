// src/App.jsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import HomePage from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import About from './pages/About';
import Career from './pages/Career';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AddProperty from './admin/AddProperty';
import AddJob from './admin/AddJob';



import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <Toaster position="top-center" />
      {!isAdminRoute && <Navbar />}
      <main className="min-h-screen">
        <Routes>

          {/* ====================== PUBLIC ROUTES ====================== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/career" element={<Career />} />

          {/* Optional region pages (agar use kar rahe ho) */}
          {/* <Route path="/vasundhara" element={<RegionPage region="Vasundhara" />} /> */}

          {/* ====================== ADMIN ROUTES ====================== */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Area */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                {/* Admin Layout could go here if needed */}
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="add" element={<AddProperty />} />
                  <Route path="edit/:id" element={<AddProperty />} />
                  <Route path="add-job" element={<AddJob />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* 404 - Not Found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
}

export default App;