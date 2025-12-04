import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Building2, Phone, Info, User, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

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
                        className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
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

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
