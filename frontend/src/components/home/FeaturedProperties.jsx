import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';
import { Phone, MessageCircle, Heart, Star, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import PropertyCardSkeleton from '../common/PropertyCardSkeleton'; // Import Skeleton

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
        return featured; // Default to featured for trending for now
    };

    const properties = getProperties();

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 mb-8"
                    >
                        Discover Properties
                    </motion.h2>

                    <div className="inline-flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                        {[
                            { id: 'featured', icon: Star, label: 'Featured' },
                            { id: 'recent', icon: Clock, label: 'Recently Viewed' },
                            { id: 'trending', icon: TrendingUp, label: 'Trending' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveView(tab.id)}
                                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${activeView === tab.id
                                    ? 'bg-white text-blue-600 shadow-lg scale-105'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
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
                    <div className="text-center py-20 bg-slate-50 rounded-3xl">
                        <p className="text-slate-500 text-xl font-medium">No properties found in this category.</p>
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
                        className="pb-12 px-4"
                    >
                        {properties.map(property => (
                            <SwiperSlide key={property.id}>
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100"
                                >
                                    <Link to={`/property/${property.id}`} className="block relative">
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img
                                                src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                                                alt={property.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80"></div>

                                        {/* Badges */}
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            <span className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                {property.transactionType === 'Sell' ? 'For Sale' : 'For Rent'}
                                            </span>
                                            {property.featured && (
                                                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-current" /> Featured
                                                </span>
                                            )}
                                        </div>


                                    </Link>

                                    {/* Contact Buttons (Moved Outside Link) */}
                                    <div className="absolute top-4 right-16 flex gap-2 z-10">
                                        {property.contactPhone && (
                                            <>
                                                <a
                                                    href={`tel:${property.contactPhone}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-white/90 p-2 rounded-full hover:bg-emerald-500 hover:text-white transition-colors shadow-lg"
                                                >
                                                    <Phone className="w-4 h-4" />
                                                </a>
                                                <a
                                                    href={`https://wa.me/91${property.contactPhone?.replace(/\D/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-white/90 p-2 rounded-full hover:bg-emerald-500 hover:text-white transition-colors shadow-lg"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                </a>
                                            </>
                                        )}
                                    </div>

                                    {/* Wishlist Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleWishlist(property.id);
                                        }}
                                        className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:scale-110 transition z-10"
                                    >
                                        <Heart
                                            className={`w-5 h-5 ${wishlist.includes(property.id) ? 'fill-blue-500 text-blue-500' : 'text-slate-600'}`}
                                        />
                                    </button>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{property.title}</h3>
                                        <p className="text-2xl font-bold text-blue-600 mb-4">
                                            ₹{property.price?.toLocaleString('en-IN') || 'N/A'}
                                        </p>

                                        <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4">
                                            <span className="flex items-center gap-1">
                                                <span className="font-semibold text-slate-900">{property.bhk}</span> BHK
                                            </span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="flex items-center gap-1">
                                                <span className="font-semibold text-slate-900">{property.area}</span> sqft
                                            </span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="truncate max-w-[100px]">{property.region}</span>
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
