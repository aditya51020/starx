import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Suspense, lazy } from 'react';

// Lazy Load Pages
const HomePage = lazy(() => import('./pages/Home'));
const Properties = lazy(() => import('./pages/Properties'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Career = lazy(() => import('./pages/Career'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Compare = lazy(() => import('./pages/Compare'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

// Lazy Load Admin Pages
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AddProperty = lazy(() => import('./admin/AddProperty'));
const AddJob = lazy(() => import('./admin/AddJob'));



import { useAuth } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext'; // Import CompareProvider
import CompareFloat from './components/CompareFloat'; // Import CompareFloat

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return user ? children : <Navigate to="/admin/login" replace />;
};

import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop'; // Import ScrollToTop

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <CompareProvider>
        <ScrollToTop /> {/* Add ScrollToTop here */}
        <Toaster position="top-center" />
        {!isAdminRoute && <Navbar />}
        <main className="min-h-screen">
          <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
            <Routes>

              {/* ====================== PUBLIC ROUTES ====================== */}
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/career" element={<Career />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />

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
          </Suspense>
        </main>
        {!isAdminRoute && <CompareFloat />}
        <Footer />
      </CompareProvider>
    </AuthProvider>
  );
}

export default App;