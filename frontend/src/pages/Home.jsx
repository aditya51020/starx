// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Train, Hospital, School, ShoppingCart, Coffee, CheckCircle, Star, Quote } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

// Components
import HeroSection from '../components/home/HeroSection';
import FeaturedProperties from '../components/home/FeaturedProperties';
import IndirapuramLocalities from '../components/home/IndirapuramLocalities';
import TrustSection from '../components/home/TrustSection';
import StickySearch from '../components/home/StickySearch';
import MapSection from '../components/home/MapSection';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [recentProps, setRecentProps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [activeView, setActiveView] = useState('featured');


  const navigate = useNavigate();

        // Set active tab logic
        // eslint-disable-next-line no-unused-vars

  const nearbyCategories = [
    { icon: Train, label: 'Metro', color: 'blue' },
    { icon: Hospital, label: 'Hospital', color: 'red' },
    { icon: School, label: 'School', color: 'green' },
    { icon: ShoppingCart, label: 'Mall', color: 'purple' },
    { icon: Coffee, label: 'Cafes', color: 'orange' }
  ];

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const savedViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setWishlist(savedWishlist);

    const fetchPromises = [
      api.get('/api/properties?featured=true&limit=10'),
      api.get('/api/properties?limit=50')
    ];

    if (savedViewed.length > 0) {
      fetchPromises.push(api.get(`/api/properties?ids=${savedViewed.join(',')}`));
    }

    Promise.all(fetchPromises)
      .then((responses) => {
        const featuredRes = responses[0];
        const allRes = responses[1];
        const recentRes = savedViewed.length > 0 ? responses[2] : null;

        const featuredData = featuredRes.data?.data || featuredRes.data || [];
        const allData = allRes.data?.data || allRes.data || [];
        const recentData = recentRes ? (recentRes.data?.data || recentRes.data || []) : [];

        // Filter properties for Indirapuram
        const filterForIndirapuram = (arr) => arr.filter(p => p.region && p.region.toLowerCase().includes('indirapuram'));

        setFeatured(filterForIndirapuram(Array.isArray(featuredData) ? featuredData : []));
        setAllProperties(filterForIndirapuram(Array.isArray(allData) ? allData : []));
        setRecentProps(filterForIndirapuram(Array.isArray(recentData) ? recentData : []));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load properties:', err);
        setFeatured([]);
        setAllProperties([]);
        setRecentProps([]);
        setLoading(false);
      });
  }, []);

  const toggleWishlist = (propertyId) => {
    const newWishlist = wishlist.includes(propertyId)
      ? wishlist.filter(id => id !== propertyId)
      : [...wishlist, propertyId];

    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const handleSearch = (filters) => {
    const params = new URLSearchParams();
    if (filters.region) params.append('region', filters.region);
    if (filters.transactionType) params.append('transactionType', filters.transactionType);
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    if (filters.bhk) params.append('bhk', filters.bhk);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

    navigate(`/properties?${params.toString()}`);
  };





  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Helmet>
        <title>StarX Properties – Premium Real Estate in Indirapuram, Ghaziabad</title>
        <meta name="description" content="Find premium properties for sale and rent in Indirapuram, Ghaziabad. StarX Properties is your trusted real estate partner in Nyay Khand, Ahinsa Khand, and Vaibhav Khand." />
        <meta name="keywords" content="starx properties, real estate agent in indirapuram, buy property in indirapuram, flats in indirapuram, rent property in indirapuram, property dealer in ghaziabad" />
        <link rel="canonical" href="https://www.starxproperties.in/" />
        {/* Structured Data for RealEstateAgent */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "StarX Properties",
              "image": "https://www.starxproperties.in/logo.png",
              "description": "Premium real estate agency specializing in Indirapuram, Ghaziabad.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Indirapuram",
                "addressRegion": "Uttar Pradesh",
                "addressCountry": "IN"
              },
              "telephone": "+919212153683"
            }
          `}
        </script>
        {/* Structured Data for FAQ */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [{
                "@type": "Question",
                "name": "Why invest in Indirapuram?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Indirapuram offers excellent metro connectivity, premium schools, hospitals, and high rental yields, making it the best real estate investment hub in Ghaziabad."
                }
              }, {
                "@type": "Question",
                "name": "What are the top localities in Indirapuram?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The top premium localities include Nyay Khand, Ahinsa Khand, Vaibhav Khand, and Shipra Suncity."
                }
              }]
            }
          `}
        </script>
      </Helmet>

      <StickySearch />

      <HeroSection onSearch={handleSearch} />

      <FeaturedProperties
        activeView={activeView}
        setActiveView={setActiveView}
        loading={loading}
        featured={featured}
        recentlyViewedProperties={recentProps}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
      />

      <IndirapuramLocalities />

      <TrustSection />

      <MapSection
        allProperties={allProperties}
        nearbyCategories={nearbyCategories}
      />

      {/* Sell Property Banner */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="w-full bg-slate-900 rounded-3xl p-8 md:p-12 relative flex flex-col md:flex-row items-center justify-between shadow-xl overflow-hidden border border-gray-800">
            {/* Background flair */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[60px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-sm font-bold text-[#D4AF37] tracking-widest uppercase mb-2">For Property Owners</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Have a property to sell or rent?
                </h3>
                <p className="text-slate-400 text-lg">List your property & connect with clients faster!</p>
              </div>

              <a
                href="https://wa.me/919212153683?text=Hi, I want to sell my property via StarX Properties."
                target="_blank"
                rel="noreferrer"
                className="bg-[#D4AF37] text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-[#C5A059] transition-colors whitespace-nowrap shadow-lg text-lg flex-shrink-0"
              >
                Sell your property
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Collage Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#D4AF37] font-bold tracking-widest uppercase text-sm">Reviews</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2">Loved by Families</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            {/* Card 1: Large Testimonial */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <Quote className="w-12 h-12 text-[#D4AF37] relative z-10 mb-6" />

              <p className="text-2xl font-serif text-slate-800 leading-relaxed relative z-10">
                "StarX made the impossible possible. We were looking for a specific vastu-compliant home in Vasundhara, and they found it within a week! truly exceptional service."
              </p>

              <div className="flex items-center gap-4 mt-8">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
                <div>
                  <h4 className="font-bold text-lg text-slate-900">Rajesh Kumar</h4>
                  <p className="text-slate-500 text-sm">Homeowner • Vasundhara</p>
                  <div className="flex gap-0.5 text-[#D4AF37] mt-1">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-3 h-3 fill-current" />)}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Image Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-1 md:row-span-1 bg-black rounded-[2rem] overflow-hidden relative group"
            >
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" alt="Happy Family" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <p className="text-white font-bold text-lg">500+ Families</p>
                <p className="text-gray-300 text-xs">Settled this year</p>
              </div>
            </motion.div>

            {/* Card 3: Compact Testimonial */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-1 md:row-span-1 bg-[#D4AF37] p-6 rounded-[2rem] text-slate-900 flex flex-col justify-center relative hover:-translate-y-1 transition-transform"
            >
              <Quote className="w-8 h-8 text-slate-800/40 mb-4" />
              <p className="font-medium text-lg mb-4">"Best ROI on my Indirapuram investment. Highly recommended!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900/10 rounded-full flex items-center justify-center font-bold text-slate-800">PS</div>
                <div>
                  <p className="font-bold text-sm">Priya Sharma</p>
                  <p className="text-slate-800/70 text-xs">Investor</p>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Stat Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="md:col-span-1 md:row-span-1 bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 flex flex-col justify-center items-center text-center hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl font-extrabold text-[#D4AF37] mb-2">Top Rated</div>
              <div className="flex gap-1 justify-center mb-2 text-[#D4AF37]">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-500 font-medium">Real Estate Agency</p>
              <p className="text-xs text-slate-400 mt-1">Trusted by hundreds</p>
            </motion.div>

            {/* Card 5: Medium Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="md:col-span-1 md:row-span-1 bg-slate-900 p-6 rounded-[2rem] text-white flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <p className="text-gray-300 italic leading-relaxed relative z-10">
                "Seamless rental process in Sector 63. Professional team."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" alt="User" className="w-10 h-10 rounded-full border border-white/20" />
                <div>
                  <p className="font-bold text-white text-sm">Amit Verma</p>
                  <p className="text-gray-500 text-xs">Tenant</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight">Ready to find your new home?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect property with StarX Properties.
          </p>
          <button
            onClick={() => navigate('/properties')}
            className="bg-[#D4AF37] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#C5A059] transition-all shadow-xl hover:shadow-[#D4AF37]/25 transform hover:-translate-y-1"
          >
            Browse All Properties
          </button>
        </div>
      </section>
    </div>
  );
}