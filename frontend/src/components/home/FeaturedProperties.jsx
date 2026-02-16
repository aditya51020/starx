import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';
import { Phone, MessageCircle, Heart, Star, Clock, TrendingUp, MapPin, ArrowRight, Maximize, Bed } from 'lucide-react';
import { motion } from 'framer-motion';
import PropertyCardSkeleton from '../common/PropertyCardSkeleton';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

export default function FeaturedProperties({
    activeView,
    setActiveView,
    loading,
    featured,
    recentlyViewedProperties,
    wishlist,
    toggleWishlist
}) {

    const getProperties = () => {
        if (activeView === 'featured') return featured;
        if (activeView === 'recent') return recentlyViewedProperties;
        return featured;
    };

    const properties = getProperties();

    return (
        <section className="py-24 bg-gray-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>


            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-bold text-[#D4AF37] tracking-widest uppercase mb-2">Exclusive Listings</h2>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 tracking-tight">Discover Your Next Home</h3>
                    </motion.div>

                    <div className="inline-flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                        {[
                            { id: 'featured', icon: Star, label: 'Featured' },
                            { id: 'recent', icon: Clock, label: 'Recently Viewed' },
                            { id: 'trending', icon: TrendingUp, label: 'Trending' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveView(tab.id)}
                                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${activeView === tab.id
                                    ? 'bg-slate-900 text-white shadow-lg scale-105'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="hidden md:block">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <PropertyCardSkeleton key={i} />
                        ))}
                    </div>
                ) : properties.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <p className="text-slate-500 text-xl font-medium">No properties found.</p>
                    </div>
                ) : (
                    <Swiper
                        modules={[Navigation, Autoplay, EffectCoverflow]}
                        effect="coverflow"
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 100,
                            modifier: 2.5,
                            slideShadows: false,
                        }}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 }
                        }}
                        className="pb-16 px-4"
                    >
                        {properties.map(property => (
                            <SwiperSlide key={property.id}>
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="group relative bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col"
                                >
                                    <Link to={`/property/${property.id}`} className="block relative">
                                        <div className="aspect-[4/3] overflow-hidden relative">
                                            <img
                                                src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                                                alt={property.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                                            {/* Hover View Button */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <span className="bg-white/20 backdrop-blur-md border border-white/50 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                                    View Details <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>

                                        {/* Top Badges */}
                                        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                            <span className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-white/50">
                                                {property.transactionType === 'Sell' ? 'For Sale' : 'For Rent'}
                                            </span>
                                            {property.featured && (
                                                <span className="bg-[#D4AF37] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 border border-[#C5A059]">
                                                    <Star className="w-3 h-3 fill-current" /> Featured
                                                </span>
                                            )}
                                        </div>

                                        {/* Price Tag (Over Image) */}
                                        <div className="absolute bottom-4 left-4 text-white z-10">
                                            <p className="text-xs font-bold opacity-90 uppercase tracking-wider mb-1">Starts From</p>
                                            <p className="text-2xl font-extrabold tracking-tight">
                                                ₹{property.price?.toLocaleString('en-IN') || 'N/A'}
                                            </p>
                                        </div>

                                    </Link>

                                    {/* Action Buttons (Floating) */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleWishlist(property.id);
                                            }}
                                            className="bg-white/30 backdrop-blur-md p-2.5 rounded-full shadow-lg hover:bg-white transition-all group/btn border border-white/20"
                                        >
                                            <Heart
                                                className={`w-5 h-5 transition-colors ${wishlist.includes(property.id) ? 'fill-red-500 text-red-500' : 'text-white group-hover/btn:text-red-500'}`}
                                            />
                                        </button>
                                        <a
                                            href={`https://wa.me/919958253683`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="bg-white/30 backdrop-blur-md p-2.5 rounded-full shadow-lg hover:bg-[#25D366] hover:border-[#25D366] transition-all group/btn border border-white/20 text-white"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                        </a>
                                    </div>

                                    {/* Content Info */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-1 text-[#D4AF37] text-xs font-bold mb-2 uppercase tracking-wide">
                                                <MapPin className="w-3 h-3" /> {property.region}
                                            </div>
                                            <Link to={`/property/${property.id}`}>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2 truncate hover:text-[#D4AF37] transition-colors">{property.title}</h3>
                                            </Link>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 padding-top-4 border-t border-gray-100 pt-4">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Bed className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm font-bold">{property.bhk} BHK</span>
                                            </div>
                                            <div className="w-px h-4 bg-gray-200"></div>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Maximize className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm font-bold">{property.area} sqft</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </section>
    );
}
