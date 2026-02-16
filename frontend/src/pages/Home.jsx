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
import LocationCards from '../components/home/LocationCards';
import MapSection from '../components/home/MapSection';
import EMICalculator from '../components/home/EMICalculator';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [recentProps, setRecentProps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [activeView, setActiveView] = useState('featured');


  const navigate = useNavigate();

  const priceTrends = {
    'Vasundhara': { trend: '+12%', avgPrice: '45L', demand: 'High' },
    'Indirapuram': { trend: '+8%', avgPrice: '62L', demand: 'Very High' },
    'Sector 63': { trend: '+15%', avgPrice: '52L', demand: 'Medium' }
  };

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

        setFeatured(Array.isArray(featuredData) ? featuredData : []);
        setAllProperties(Array.isArray(allData) ? allData : []);
        setRecentProps(Array.isArray(recentData) ? recentData : []);
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



  const locationData = [
    {
      name: 'Vasundhara',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      count: allProperties.filter(p => p.region === 'Vasundhara').length,
      ...priceTrends['Vasundhara']
    },
    {
      name: 'Indirapuram',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      count: allProperties.filter(p => p.region === 'Indirapuram').length,
      ...priceTrends['Indirapuram']
    },
    {
      name: 'Sector 63',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      count: allProperties.filter(p => p.region === 'Sector 63').length,
      ...priceTrends['Sector 63']
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Helmet>
        <title>StarX Buildtech – Real Estate & Property Development Company</title>
        <meta name="description" content="StarX Buildtech (also known as Star X or Starx Properties) is a trusted real estate and construction company in Ghaziabad, offering premium properties in Vasundhara, Indirapuram, and Sector 63." />
        <meta name="keywords" content="starx properties, starx buildtech, star x properties, star x buildtech, starx real estate, starx property dealer, starx properties ghaziabad, property dealer in ghaziabad, real estate agent in indirapuram, property consultant in ghaziabad, real estate agent in vasundhara, buy property in indirapuram, commercial property in ghaziabad" />
        <link rel="canonical" href="https://www.starxbuildtech.co.in/" />
      </Helmet>

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

      <LocationCards locationData={locationData} />

      {/* Why Choose Us - Modern Split Layout */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[120px] -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -ml-10 -mb-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-[1px] bg-[#D4AF37]"></div>
                <span className="text-[#D4AF37] font-bold tracking-widest uppercase text-xs">The StarX Advantage</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                Not just an Agency, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
                  We are Your Partners.
                </span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
                Experience real estate with clarity. From verified listings to seamless paperwork, we redefine how Ghaziabad lives.
              </p>
              <button
                onClick={() => navigate('/about')}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-full text-white font-bold transition-all flex items-center gap-2 group"
              >
                More About Us
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>

            {/* Right: Stats Grid (Bento Style) */}
            <div className="grid grid-cols-2 gap-4">
              {/* Stat 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:border-[#D4AF37]/30 transition-colors group"
              >
                <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">100%</h3>
                <p className="text-slate-400 text-sm">Verified Listings</p>
              </motion.div>

              {/* Stat 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-[#D4AF37] p-6 rounded-3xl flex flex-col justify-between text-slate-900"
              >
                <div className="flex justify-end">
                  <Star className="w-8 h-8 opacity-20" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-1">5k+</h3>
                  <p className="text-slate-800/70 text-sm font-medium">Happy Families</p>
                </div>
              </motion.div>

              {/* Stat 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="col-span-2 bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-3xl border border-white/5 flex items-center gap-6"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                  <Quote className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">Transparent Deals</h4>
                  <p className="text-slate-400 text-sm">No hidden charges. Complete clarity.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <MapSection
        allProperties={allProperties}
        nearbyCategories={nearbyCategories}
      />

      {/* Testimonials Collage Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#D4AF37] font-bold tracking-widest uppercase text-sm">Real Stories</span>
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
              <div className="text-4xl font-extrabold text-[#D4AF37] mb-2">4.9/5</div>
              <div className="flex gap-1 justify-center mb-2 text-[#D4AF37]">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-500 font-medium">Average User Rating</p>
              <p className="text-xs text-slate-400 mt-1">Based on 1200+ reviews</p>
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
            Join thousands of satisfied customers who found their perfect property with StarX.
          </p>
          <button
            onClick={() => navigate('/properties')}
            className="bg-[#D4AF37] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#C5A059] transition-all shadow-xl hover:shadow-[#D4AF37]/25 transform hover:-translate-y-1"
          >
            Browse All Properties
          </button>
        </div>
      </section>

      <EMICalculator />
    </div>
  );
}