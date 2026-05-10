import { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const INDIRAPURAM_LOCALITIES = [
    'Nyay Khand', 'Ahinsa Khand', 'Vaibhav Khand', 'Shipra Suncity',
    'Niti Khand', 'Gyan Khand', 'Shakti Khand', 'Khandsha'
];

export default function StickySearch() {
    const [isVisible, setIsVisible] = useState(false);
    const [filters, setFilters] = useState({
        region: '',
        bhk: '',
        maxPrice: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past the hero section (approx 500px)
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        // Since we are focusing on Indirapuram, if no region is selected, default to Indirapuram
        if (filters.region) {
            params.append('region', filters.region);
        } else {
            params.append('region', 'Indirapuram');
        }
        if (filters.bhk) params.append('bhk', filters.bhk);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

        navigate(`/properties?${params.toString()}`);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 py-3 px-4 hidden md:block"
                >
                    <div className="container mx-auto">
                        <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-5xl mx-auto">
                            <div className="flex items-center gap-2 font-bold text-gray-900 mr-4">
                                <span className="text-[#D4AF37]">StarX Properties</span> Indirapuram
                            </div>

                            <div className="flex-1 flex bg-gray-50 rounded-lg border border-gray-200 overflow-hidden focus-within:border-[#D4AF37] transition-colors">
                                <div className="flex items-center pl-3">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                </div>
                                <select
                                    value={filters.region}
                                    onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                                    className="w-full bg-transparent border-none outline-none px-2 py-2.5 text-sm text-gray-700 appearance-none"
                                >
                                    <option value="">All Localities in Indirapuram</option>
                                    {INDIRAPURAM_LOCALITIES.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-32 flex bg-gray-50 rounded-lg border border-gray-200 overflow-hidden focus-within:border-[#D4AF37] transition-colors">
                                <select
                                    value={filters.bhk}
                                    onChange={(e) => setFilters({ ...filters, bhk: e.target.value })}
                                    className="w-full bg-transparent border-none outline-none px-3 py-2.5 text-sm text-gray-700 appearance-none"
                                >
                                    <option value="">BHK</option>
                                    <option value="1">1 BHK</option>
                                    <option value="2">2 BHK</option>
                                    <option value="3">3 BHK</option>
                                    <option value="4">4+ BHK</option>
                                </select>
                            </div>

                            <div className="w-40 flex bg-gray-50 rounded-lg border border-gray-200 overflow-hidden focus-within:border-[#D4AF37] transition-colors">
                                <select
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                    className="w-full bg-transparent border-none outline-none px-3 py-2.5 text-sm text-gray-700 appearance-none"
                                >
                                    <option value="">Max Budget</option>
                                    <option value="5000000">₹ 50 Lakh</option>
                                    <option value="10000000">₹ 1 Cr</option>
                                    <option value="20000000">₹ 2 Cr</option>
                                    <option value="50000000">₹ 5 Cr</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="bg-[#D4AF37] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#C5A059] transition shadow-sm flex items-center gap-2"
                            >
                                <Search className="w-4 h-4" /> Search
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
