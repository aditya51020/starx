import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Home, DollarSign, X } from 'lucide-react';
import { motion } from 'framer-motion';
import CustomDropdown from '../common/CustomDropdown';
import PriceRangeDropdown from '../common/PriceRangeDropdown';

const PREDEFINED_LOCATIONS = [
    'Vasundhara',
    'Indirapuram',
    'Sector 63',
    'Sector 62',
    'Sector 61',
    'Niti Khand',
    'Raj Nagar Extension',
    'Crossings Republik',
    'Noida Extension',
    'Greater Noida West',
    'Siddharth Vihar',
    'Govindpuram',
];

export default function HeroSection({ onSearch }) {
    const [filters, setFilters] = useState({
        region: '',
        transactionType: '',
        propertyType: '',
        bhk: '',
        minPrice: '',
        maxPrice: ''
    });

    // Location search state
    const [locationInput, setLocationInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const locationRef = useRef(null);

    const filteredLocations = locationInput.trim()
        ? PREDEFINED_LOCATIONS.filter(loc =>
            loc.toLowerCase().includes(locationInput.toLowerCase())
        )
        : PREDEFINED_LOCATIONS;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (locationRef.current && !locationRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLocationSelect = (loc) => {
        setLocationInput(loc);
        setFilters(prev => ({ ...prev, region: loc }));
        setShowSuggestions(false);
    };

    const handleLocationInputChange = (e) => {
        const val = e.target.value;
        setLocationInput(val);
        setFilters(prev => ({ ...prev, region: val }));
        setShowSuggestions(true);
    };

    const clearLocation = () => {
        setLocationInput('');
        setFilters(prev => ({ ...prev, region: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };

    // Transaction Type Tabs for Housing Style
    const transactionTabs = ['Buy', 'Rent', 'Commercial', 'PG/Co-living', 'Plots'];

    return (
        <section className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-20 bg-slate-900 border-b border-gray-800">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>
            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-sm">
                        Properties for rent in Ghaziabad
                    </h1>
                    <p className="text-white/90 font-medium text-lg drop-shadow-sm">
                        <span className="font-bold">7K+</span> listings added daily and <span className="font-bold">73K+</span> total verified
                    </p>
                </motion.div>

                {/* Centralized Search Box */}
                <div className="max-w-4xl mx-auto rounded-t-xl overflow-hidden bg-black/40 backdrop-blur-md">
                    {/* Tabs */}
                    <div className="flex overflow-x-auto no-scrollbar">
                        {transactionTabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setFilters({ ...filters, transactionType: tab === 'Buy' ? 'Sell' : tab })}
                                className={`px-6 py-3.5 text-sm font-bold transition-colors whitespace-nowrap ${(filters.transactionType === tab || (filters.transactionType === 'Sell' && tab === 'Buy') || (!filters.transactionType && tab === 'Buy'))
                                    ? 'text-white border-b-2 border-white'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-4xl mx-auto bg-white rounded-b-xl rounded-tr-xl shadow-2xl p-2 md:p-3 relative z-20 flex flex-col md:flex-row gap-2 items-center">
                    <form onSubmit={handleSubmit} className="flex-1 flex w-full relative" ref={locationRef}>
                        <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-4 border border-gray-200">
                            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <input
                                type="text"
                                value={locationInput}
                                onChange={handleLocationInputChange}
                                onFocus={() => setShowSuggestions(true)}
                                placeholder="Search for locality, landmark, project, or builder"
                                className="w-full bg-transparent border-none outline-none px-3 py-3.5 text-gray-800 placeholder:text-gray-400 text-base font-medium"
                            />
                            {locationInput && (
                                <button type="button" onClick={clearLocation} className="text-gray-400 hover:text-gray-600 p-1">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto">
                                {filteredLocations.length > 0 ? (
                                    filteredLocations.map((loc) => (
                                        <div
                                            key={loc}
                                            onMouseDown={() => handleLocationSelect(loc)}
                                            className="px-5 py-3 cursor-pointer flex items-center gap-3 hover:bg-[#F3E5AB]/20 hover:text-[#D4AF37] transition-colors text-slate-700"
                                        >
                                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            {loc}
                                        </div>
                                    ))
                                ) : (
                                    <div
                                        onMouseDown={() => { setShowSuggestions(false); }}
                                        className="px-5 py-3 flex items-center gap-3 text-slate-500 cursor-pointer hover:bg-gray-50"
                                    >
                                        <Search className="w-4 h-4 text-[#D4AF37]" />
                                        Search for "<span className="font-semibold text-slate-700">{locationInput}</span>"
                                    </div>
                                )}
                            </div>
                        )}
                    </form>
                    <button
                        onClick={handleSubmit}
                        className="w-full md:w-auto bg-[#D4AF37] text-white px-8 py-3.5 rounded-lg font-bold hover:bg-[#C5A059] transition shadow-md whitespace-nowrap"
                    >
                        Search
                    </button>
                </div>

                {/* Popular Localities Quick Links */}
                <div className="max-w-4xl mx-auto mt-6 flex flex-wrap items-center gap-3">
                    <span className="text-white/90 text-sm font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> Popular Localities
                    </span>
                    {['Vasundhara', 'Indirapuram', 'Sector 63', 'Vaishali'].map((loc) => (
                        <button
                            key={loc}
                            onClick={() => {
                                setFilters({ ...filters, region: loc });
                                setTimeout(() => onSearch({ ...filters, region: loc }), 100);
                            }}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-4 py-1.5 rounded-md text-sm transition font-medium"
                        >
                            {loc}
                        </button>
                    ))}
                </div>

                {/* Floating Banner (Are you a Property Owner) */}
                <div className="max-w-2xl mx-auto mt-12 bg-black/40 backdrop-blur-md rounded-full px-6 py-2 border border-white/20 flex items-center justify-center gap-2 hover:bg-black/50 transition cursor-pointer">
                    <span className="text-white/90 font-medium text-sm">✨ Are you a Property Owner?</span>
                    <a href={`https://wa.me/919212153683?text=Hi, I want to list my property on StarX.`} target="_blank" rel="noreferrer" className="text-white font-bold text-sm underline-offset-4 hover:underline">
                        Sell / Rent
                    </a>
                </div>

            </div>

            {/* Decorative Side Image similar to Housing.com (Family in box) */}
            <div className="absolute right-0 top-10 lg:w-[400px] h-[500px] hidden xl:block pointer-events-none opacity-90 mix-blend-multiply">
                {/* Simulated graphic using a CSS mask/clip-path for the card shape could be used, for now a rounded image */}
                <img
                    src="https://images.unsplash.com/photo-1576089172869-4f5f6f315620?q=80&w=800&auto=format&fit=crop"
                    alt="Happy Family"
                    className="w-full h-full object-cover rounded-tl-[4rem] rounded-bl-[4rem] shadow-2xl skew-x-[-5deg] translate-x-12 opacity-80"
                />
            </div>
        </section>
    );
}
