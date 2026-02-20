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

    return (
        <section className="relative bg-white pt-24 pb-12 lg:pt-28 lg:pb-16 overflow-hidden flex items-center">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

                    {/* Left Column: Text & Search (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-3 block">
                                Premium Real Estate
                            </span>
                            <h1 className="text-4xl lg:text-5xl/tight font-serif text-slate-900 mb-4">
                                Find Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#b38f2d]">
                                    Dream Space
                                </span>
                            </h1>
                            <p className="text-base text-slate-500 max-w-md leading-relaxed mb-6">
                                Curated properties in Vasundhara, Indirapuram & Sector 63.
                            </p>

                            {/* Minimal Search Card */}
                            <div className="bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl relative">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                                    {/* Location - Searchable Input */}
                                    <div className="relative" ref={locationRef}>
                                        <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-transparent hover:border-gray-200 focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all">
                                            <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                                            <input
                                                type="text"
                                                value={locationInput}
                                                onChange={handleLocationInputChange}
                                                onFocus={() => setShowSuggestions(true)}
                                                placeholder="Search any location..."
                                                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 font-semibold placeholder:text-slate-400 placeholder:font-normal"
                                            />
                                            {locationInput && (
                                                <button type="button" onClick={clearLocation} className="text-slate-400 hover:text-slate-600">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Suggestions Dropdown */}
                                        {showSuggestions && (
                                            <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 max-h-52 overflow-y-auto">
                                                {filteredLocations.length > 0 ? (
                                                    filteredLocations.map((loc) => (
                                                        <div
                                                            key={loc}
                                                            onMouseDown={() => handleLocationSelect(loc)}
                                                            className="px-4 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-[#FFFDF0] hover:text-[#D4AF37] transition-colors text-sm text-slate-600"
                                                        >
                                                            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                                                            {loc}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div
                                                        onMouseDown={() => { setShowSuggestions(false); }}
                                                        className="px-4 py-2.5 flex items-center gap-2 text-sm text-slate-500 cursor-pointer hover:bg-gray-50"
                                                    >
                                                        <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
                                                        Search for "<span className="font-semibold text-slate-700">{locationInput}</span>"
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Type & Budget - Compact Row */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-transparent hover:border-gray-200 transition-colors">
                                            <Home className="w-4 h-4 text-gray-400" />
                                            <div className="flex-1 min-w-0">
                                                <CustomDropdown
                                                    value={filters.propertyType}
                                                    onChange={(val) => setFilters({ ...filters, propertyType: val })}
                                                    placeholder="Property Type"
                                                    options={[
                                                        { value: '', label: 'All' },
                                                        { value: 'Apartment', label: 'Apt' },
                                                        { value: 'Villa', label: 'Villa' },
                                                        { value: 'House', label: 'Home' },
                                                        { value: 'Plot', label: 'Plot' }
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-transparent hover:border-gray-200 transition-colors">
                                            <DollarSign className="w-4 h-4 text-gray-400" />
                                            <div className="flex-1 min-w-0">
                                                <PriceRangeDropdown filters={filters} setFilters={setFilters} minimal={true} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Search Button */}
                                    <button
                                        type="submit"
                                        className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-[#D4AF37] transition-all shadow-lg hover:shadow-orange-500/20 flex items-center justify-center gap-2 mt-1"
                                    >
                                        <Search className="w-4 h-4" />
                                        Search
                                    </button>
                                </form>
                            </div>

                            {/* Trust Badge - Minimal */}
                            <div className="mt-6 flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 font-medium">Trusted by <span className="text-slate-900 font-bold">5k+</span> families</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Video (7 cols) */}
                    <div className="lg:col-span-7 relative h-[500px] lg:h-[580px] hidden md:block">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="absolute top-0 right-0 w-full h-full rounded-[2rem] overflow-hidden bg-gray-100"
                        >
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                                poster="https://images.unsplash.com/photo-1600596542815-27a906529aac?q=80&w=1920&auto=format&fit=crop"
                            >
                                <source src="https://videos.pexels.com/video-files/3254006/3254006-hd_1920_1080_25fps.mp4" type="video/mp4" />
                            </video>

                            {/* Floating Stats - Minimal */}
                            <div className="absolute top-6 right-6 z-20">
                                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm text-center">
                                    <p className="text-sm font-bold text-slate-900">Yield <span className="text-[#D4AF37]">12%</span></p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
