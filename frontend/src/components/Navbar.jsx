import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Building2, Phone, Info, Briefcase, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Properties', path: '/properties', icon: Building2 },
        { name: 'Career', path: '/career', icon: Briefcase },
        { name: 'About Us', path: '/about', icon: Info },
        { name: 'Contact', path: '/contact', icon: Phone },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <span className={`text-2xl font-bold ${scrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                            Star<span className="text-blue-600">X</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`font-medium transition-colors hover:text-blue-600 ${location.pathname === link.path ? 'text-blue-600' : 'text-slate-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Auth Buttons */}
                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                        <User className="w-4 h-4" />
                                    </div>
                                    Hi, {user.name || 'User'}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-600 hover:text-red-600 transition"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                                <Link
                                    to="/login"
                                    className="text-blue-600 font-semibold hover:text-blue-700"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-slate-100 overflow-hidden shadow-xl"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${location.pathname === link.path
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <link.icon className="w-5 h-5" />
                                    <span className="font-medium">{link.name}</span>
                                </Link>
                            ))}

                            <div className="border-t border-gray-100 my-2"></div>

                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 p-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 p-4 rounded-xl text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium">Logout</span>
                                    </button>
                                </>
                            ) : (
                                <div className="p-4 space-y-3">
                                    <Link
                                        to="/login"
                                        className="block w-full text-center py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="block w-full text-center py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
