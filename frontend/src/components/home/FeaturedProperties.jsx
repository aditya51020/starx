import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Phone, MessageCircle, Heart, Star, Clock, TrendingUp, MapPin, ArrowRight, Maximize, Bed } from 'lucide-react';
import { motion } from 'framer-motion';
import PropertyCardSkeleton from '../common/PropertyCardSkeleton';
import { formatPrice } from '../../utils/formatPrice';

import 'swiper/css';
import 'swiper/css/navigation';

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
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 tracking-tight">Newly-added properties</h3>
                        <p className="text-slate-500 text-lg">Fresh listings to check out</p>
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
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
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
                        modules={[Navigation, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 }
                        }}
                        className="pb-16 px-2"
                    >
                        {properties.map(property => (
                            <SwiperSlide key={property.id} className="h-auto">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 h-full flex flex-col group p-3">
                                    <Link to={`/property/${property.id}`} className="block relative aspect-[4/3] overflow-hidden rounded-xl">
                                        <img
                                            src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                                            alt={property.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Status Tags */}
                                        <div className="absolute top-3 left-3 flex gap-2 z-10 flex-wrap">
                                            <span className="bg-white text-slate-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                {property.transactionType === 'Sell' ? 'For Sale' : 'For Rent'}
                                            </span>
                                            {property.featured && (
                                                <span className="bg-[#D4AF37] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-current" /> Featured
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Action Buttons (Floating) - Optional, keeping it simple */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleWishlist(property.id);
                                        }}
                                        className="absolute top-6 right-6 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white transition-all text-slate-600 hover:text-red-500 z-20"
                                    >
                                        <Heart
                                            className={`w-4 h-4 ${wishlist.includes(property.id) ? 'fill-red-500 text-red-500' : ''}`}
                                        />
                                    </button>

                                    {/* Content Section */}
                                    <div className="pt-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <Link to={`/property/${property.id}`}>
                                                <h3 className="text-lg font-bold text-slate-900 mb-1 truncate hover:text-[#D4AF37] transition-colors">
                                                    {property.title}
                                                </h3>
                                            </Link>
                                            <p className="text-slate-500 text-sm mb-3 truncate">
                                                {property.bhk} BHK {property.propertyType} • {property.region}
                                            </p>
                                        </div>

                                        <div className="mt-2 text-center items-center justify-between">
                                            <p className="text-2xl font-extrabold text-[#D4AF37] mb-4 text-left">
                                                {formatPrice(property.price) || 'N/A'}
                                            </p>
                                            <a
                                                href={`https://wa.me/919212153683?text=Hi, I am interested in property ${property.title}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full text-center py-2.5 rounded-lg border border-[#D4AF37] text-[#D4AF37] font-bold hover:bg-[#D4AF37] hover:text-white transition-colors text-sm"
                                            >
                                                Contact
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </section>
    );
}
