import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Building2, Phone, Info, Briefcase, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo_new.png';

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
        { name: 'Blog', path: '/blog', icon: LayoutDashboard },
        { name: 'About Us', path: '/about', icon: Info },
        { name: 'Contact', path: '/contact', icon: Phone },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-[2000] transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    {/* Logo - Increased contrast logic not needed as logo is image, but ensuring container is clean */}
                    <Link to="/" className="flex items-center group">
                        <img
                            src={logo}
                            alt="StarX Logo"
                            className="h-16 md:h-20 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => {
                            const isHomeTop = location.pathname === '/' && !scrolled;
                            const isActive = location.pathname === link.path;

                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`font-bold text-sm uppercase tracking-wide transition-colors hover:text-[#D4AF37] py-4 ${isActive
                                            ? 'text-[#D4AF37]'
                                            : isHomeTop
                                                ? 'text-white'
                                                : 'text-slate-900'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle mobile menu"
                        className={`lg:hidden p-2 rounded-lg transition-colors ${location.pathname === '/' && !scrolled ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
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
                        className="lg:hidden bg-white border-t border-slate-100 overflow-hidden shadow-xl"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <div key={link.name}>
                                    <Link
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center justify-between p-4 rounded-xl transition-colors ${location.pathname === link.path
                                            ? 'bg-[#FFFDF0] text-[#D4AF37]'
                                            : 'text-slate-900 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <link.icon className="w-5 h-5" />
                                            <span className="font-bold">{link.name}</span>
                                        </div>
                                    </Link>
                                </div>
                            ))}

                            <div className="border-t border-gray-100 my-2"></div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
