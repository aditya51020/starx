import { useState } from 'react';
import { Search, Sparkles, Building2, TrendingUp, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection({ onSearch, voiceQuery, isListening, startVoiceSearch }) {
    const [filters, setFilters] = useState({
        region: '',
        transactionType: '',
        propertyType: '',
        bhk: '',
        minPrice: '',
        maxPrice: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };

    return (
        <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-32 pb-40 overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 -right-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-20 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full mb-6 shadow-lg border border-white/50">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold text-slate-700">India's Smartest Property Search</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                        Find Your Dream Home in
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> StarX Properties</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto px-4">
                        Discover premium properties in Vasundhara, Indirapuram & Sector 63 with AI-powered search.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.form
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-4 md:p-6 border border-white/50"
                >
                    {voiceQuery && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200"
                        >
                            <p className="text-sm text-emerald-700 font-medium">🎤 Voice Query: "{voiceQuery}"</p>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 mb-4">
                        <div className="col-span-2 md:col-span-1 space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Location</label>
                            <select
                                value={filters.region}
                                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white"
                            >
                                <option value="">All Locations</option>
                                <option value="Vasundhara">Vasundhara</option>
                                <option value="Indirapuram">Indirapuram</option>
                                <option value="Sector 63">Sector 63</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Type</label>
                            <select
                                value={filters.transactionType}
                                onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white"
                            >
                                <option value="">Rent / Sell</option>
                                <option value="Rent">For Rent</option>
                                <option value="Sell">For Sale</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Property</label>
                            <select
                                value={filters.propertyType}
                                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white"
                            >
                                <option value="">All Types</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="House">House</option>
                                <option value="Plot">Plot</option>
                            </select>
                        </div>

                        <div className="col-span-2 md:col-span-1 space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">BHK</label>
                            <select
                                value={filters.bhk}
                                onChange={(e) => setFilters({ ...filters, bhk: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white"
                            >
                                <option value="">Any BHK</option>
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} BHK</option>)}
                                <option value="6">5+ BHK</option>
                            </select>
                        </div>

                        <div className="col-span-2 md:col-span-2 grid grid-cols-2 gap-3 md:gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Min Price</label>
                                <input
                                    type="number"
                                    placeholder="₹ Min"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Max Price</label>
                                <input
                                    type="number"
                                    placeholder="₹ Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            Search Properties
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={startVoiceSearch}
                            className={`px-6 py-4 rounded-xl font-bold transition-all border-2 ${isListening
                                ? 'bg-red-50 border-red-500 text-red-600 animate-pulse'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600'
                                }`}
                            title="Voice Search"
                        >
                            {isListening ? 'Listening...' : '🎤 Voice'}
                        </motion.button>
                    </div>
                </motion.form>

                {/* Trust Signals / Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12"
                >
                    {[
                        { icon: Building2, text: "1000+ Properties", color: "text-blue-600" },
                        { icon: TrendingUp, text: "15% YoY Growth", color: "text-emerald-600" },
                        { icon: Zap, text: "24hr Support", color: "text-yellow-600" },
                        { icon: Award, text: "Verified Listings", color: "text-purple-600" }
                    ].map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-all">
                            <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                            <span className="text-sm font-bold text-slate-700">{stat.text}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
