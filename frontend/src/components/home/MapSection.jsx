import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Home, Search as SearchIcon, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map view updates
function MapController({ center }) {
    const map = useMap();
    if (center) {
        map.flyTo(center, 13);
    }
    return null;
}

export default function MapSection({ allProperties, nearbyCategories }) {
    const [mapCenter, setMapCenter] = useState([28.6692, 77.4538]); // Default: Vasundhara
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setMapCenter([parseFloat(lat), parseFloat(lon)]);
                toast.success(`Found: ${data[0].display_name.split(',')[0]}`);
            } else {
                toast.error('Location not found');
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Search failed');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold text-slate-900 mb-6">
                        Explore Properties on Map
                    </h2>

                    <div className="flex justify-center gap-3 flex-wrap mb-8">
                        {nearbyCategories.map((cat, idx) => (
                            <motion.button
                                key={cat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 rounded-full hover:bg-white hover:shadow-md transition border border-slate-200"
                            >
                                <cat.icon className={`w-4 h-4 text-${cat.color}-500`} />
                                <span className="text-sm font-medium text-slate-700">{cat.label}</span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto mb-8 relative z-10">
                        <form onSubmit={handleSearch} className="flex gap-2 bg-white p-2 rounded-2xl shadow-lg border border-gray-100">
                            <div className="flex-1 relative">
                                <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search location (e.g., Delhi, Noida)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border-none focus:ring-0 text-gray-700 placeholder-gray-400"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSearching}
                                onClick={(e) => { e.preventDefault(); handleSearch(e); }}
                                className="bg-[#D4AF37] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#C5A059] transition disabled:opacity-70"
                            >
                                {isSearching ? '...' : 'Search'}
                            </button>
                        </form>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                    {/* Map Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-5/12 w-full h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative z-0"
                    >
                        {/* Key forces re-render if needed, but MapController handles flyTo */}
                        <MapContainer
                            center={mapCenter}
                            zoom={12}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            <MapController center={mapCenter} />
                            {allProperties.map((property) => {
                                if (property.lat && property.lng) {
                                    return (
                                        <Marker key={property.id} position={[property.lat, property.lng]}>
                                            <Popup className="custom-popup">
                                                <div className="text-center p-2 min-w-[200px]">
                                                    <img
                                                        src={property.images?.[0] || '/placeholder.jpg'}
                                                        alt={property.title}
                                                        className="w-full h-32 object-cover rounded-lg mb-3"
                                                    />
                                                    <h3 className="font-bold text-sm line-clamp-1 mb-1">{property.title}</h3>
                                                    <p className="text-[#D4AF37] font-bold text-lg mb-2">
                                                        ₹{property.price?.toLocaleString('en-IN')}
                                                    </p>
                                                    <Link
                                                        to={`/property/${property.id}`}
                                                        className="block w-full bg-[#D4AF37] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#C5A059] transition"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                }
                                return null;
                            })}
                        </MapContainer>
                    </motion.div>

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-7/12 w-full flex flex-col justify-center"
                    >
                        <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-10 border border-slate-100 shadow-xl">
                            <h3 className="text-3xl font-bold text-slate-900 mb-6">
                                Find Your Perfect Property
                            </h3>
                            <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                                Discover the best real estate opportunities in your desired location.
                                Use our interactive map to explore properties, check nearby amenities, and find your dream home in the perfect neighborhood.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                {[
                                    { icon: MapPin, title: 'Prime Locations', desc: 'Most sought-after neighborhoods' },
                                    { icon: Home, title: 'Verified Listings', desc: 'Inspected for quality & authenticity' },
                                    { icon: SearchIcon, title: 'Smart Search', desc: 'Filter by price, location & type' },
                                    { icon: Star, title: 'Premium Service', desc: 'Dedicated support from experts' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="bg-[#FFFDF0] p-3 rounded-2xl">
                                            <item.icon className="w-6 h-6 text-[#D4AF37]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                                            <p className="text-slate-500 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-[#D4AF37] rounded-2xl p-8 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all"></div>

                                <h4 className="font-bold text-2xl mb-2 relative z-10">
                                    Ready to Get Started?
                                </h4>
                                <p className="text-[#FFFDF0] mb-6 relative z-10 max-w-md">
                                    Browse through our extensive collection of properties or contact us for personalized assistance.
                                </p>
                                <Link to="/contact" className="inline-block bg-white text-[#D4AF37] px-8 py-3 rounded-xl font-bold hover:bg-[#FFFDF0] transition shadow-lg relative z-10">
                                    Contact Our Team
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
