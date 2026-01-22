import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../assets/logo.jpg';

export default function Login() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login, adminLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isAdmin) {
                await adminLogin(formData.email, formData.password);
                navigate('/admin/dashboard');
            } else {
                await login(formData.email, formData.password);
                navigate('/');
            }
            toast.success('Welcome back!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl">
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center gap-2 group mb-6">
                        <img src={logo} alt="StarX Logo" className="h-16 w-auto object-contain" />
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900">
                        {isAdmin ? 'Admin Portal' : 'Welcome Back'}
                    </h2>
                    <p className="mt-2 text-gray-600">
                        {isAdmin
                            ? 'Enter your credentials to manage properties'
                            : 'Sign in to access your saved properties'
                        }
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#D4AF37] hover:bg-[#C5A059] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-colors"
                    >
                        {isAdmin ? 'Access Dashboard' : 'Sign In'}
                    </button>
                </form>

                <div className="flex items-center justify-between text-sm">
                    <button
                        onClick={() => setIsAdmin(!isAdmin)}
                        className="text-gray-500 hover:text-gray-700 font-medium"
                    >
                        {isAdmin ? 'Not an admin? User Login' : 'Admin Login'}
                    </button>

                    {!isAdmin && (
                        <Link to="/signup" className="text-[#D4AF37] hover:text-[#C5A059] font-bold">
                            Create Account
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
