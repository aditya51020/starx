import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Home, Search, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapSection({ allProperties, nearbyCategories }) {
    const mapCenter = [28.6692, 77.4538];

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

                    <div className="flex justify-center gap-3 flex-wrap">
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
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                    {/* Map Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-5/12 w-full h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative z-0"
                    >
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
                            {allProperties.map((property) => {
                                if (property.lat && property.lng) {
                                    return (
                                        <Marker key={property._id} position={[property.lat, property.lng]}>
                                            <Popup className="custom-popup">
                                                <div className="text-center p-2 min-w-[200px]">
                                                    <img
                                                        src={property.images?.[0] || '/placeholder.jpg'}
                                                        alt={property.title}
                                                        className="w-full h-32 object-cover rounded-lg mb-3"
                                                    />
                                                    <h3 className="font-bold text-sm line-clamp-1 mb-1">{property.title}</h3>
                                                    <p className="text-blue-600 font-bold text-lg mb-2">
                                                        ₹{property.price?.toLocaleString('en-IN')}
                                                    </p>
                                                    <Link
                                                        to={`/property/${property._id}`}
                                                        className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition"
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
                                    { icon: Search, title: 'Smart Search', desc: 'Filter by price, location & type' },
                                    { icon: Star, title: 'Premium Service', desc: 'Dedicated support from experts' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="bg-blue-100 p-3 rounded-2xl">
                                            <item.icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                                            <p className="text-slate-500 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-blue-600 rounded-2xl p-8 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all"></div>

                                <h4 className="font-bold text-2xl mb-2 relative z-10">
                                    Ready to Get Started?
                                </h4>
                                <p className="text-blue-100 mb-6 relative z-10 max-w-md">
                                    Browse through our extensive collection of properties or contact us for personalized assistance.
                                </p>
                                <Link to="/contact" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg relative z-10">
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
