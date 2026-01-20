import { Link } from 'react-router-dom';
import { Building2, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="bg-blue-600 text-white p-2 rounded-xl">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold">
                                Star<span className="text-blue-500">X</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            Your trusted partner in finding the perfect property. We make real estate simple, transparent, and efficient.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Properties', path: '/properties' },
                                { name: 'About Us', path: '/about' },
                                { name: 'Contact', path: '/contact' },
                                { name: 'Admin Login', path: '/admin/login' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-slate-400 hover:text-blue-500 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Properties */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Properties</h4>
                        <ul className="space-y-4">
                            <li><Link to="/properties?region=Vasundhara" className="text-slate-400 hover:text-blue-500">Vasundhara</Link></li>
                            <li><Link to="/properties?region=Indirapuram" className="text-slate-400 hover:text-blue-500">Indirapuram</Link></li>
                            <li><Link to="/properties?region=Sector 63" className="text-slate-400 hover:text-blue-500">Sector 63</Link></li>
                            <li><Link to="/properties?type=Rent" className="text-slate-400 hover:text-blue-500">For Rent</Link></li>
                            <li><Link to="/properties?type=Sell" className="text-slate-400 hover:text-blue-500">For Sale</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-400">
                                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                                <span>Plot Number 39, Vidhayak Lane, Nyay Khand 1-Indirapuram, Ghaziabad-201014, Uttar Pradesh</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-400">
                                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                                <a href="tel:9958253683" className="hover:text-white">9958253683</a>
                            </li>
                            <li className="flex items-center gap-3 text-slate-400">
                                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                                <a href="mailto:Starxassociates@gmail.com" className="hover:text-white">Starxassociates@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} StarX Properties. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
