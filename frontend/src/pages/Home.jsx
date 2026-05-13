// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Train, Hospital, School, ShoppingCart, Coffee, CheckCircle, Star, Quote } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { slugify } from '../utils/slugify';

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
    if (filters.transactionType) params.append('transactionType', filters.transactionType);
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    if (filters.bhk) params.append('bhk', filters.bhk);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

    if (filters.region) {
      navigate(`/locality/${slugify(filters.region)}?${params.toString()}`);
    } else {
      navigate(`/properties?${params.toString()}`);
    }
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

      {/* Client Reviews Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#D4AF37] font-bold tracking-widest uppercase text-sm mb-2 block"
            >
              Testimonials
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-slate-900"
            >
              What Our Clients Say
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                name: "Deepak Rai",
                initials: "DR",
                role: "Customer",
                text: "They understood exactly what I was looking for and presented options that perfectly fit my budget and requirements in Indirapuram. Their market knowledge is outstanding. The paperwork, negotiations, and legal formalities were handled with utmost professionalism."
              },
              {
                name: "Razia Chaudhary",
                initials: "RC",
                role: "Customer",
                text: "Great full experience for purchased of 2bhk in Vaishali thank you so much Mr Raju sir."
              },
              {
                name: "Dharmendra Kumar",
                initials: "DK",
                role: "Customer",
                text: "Supub experience for purchase property i think best property dealer in Indirapuram."
              },
              {
                name: "Shubham Singh",
                initials: "SS",
                role: "Customer",
                text: "Service was friendly and they have all the options in your budget."
              },
              {
                name: "Inderjeet Singh",
                initials: "IS",
                role: "Customer",
                text: "Excellent experience with starx property. Good behaviour. Helping nature for all staff. Great management by Mr. RAJU SIR."
              },
              {
                name: "Rahul Thakur",
                initials: "RT",
                role: "Customer",
                text: "Best property consultant in ghaziabad. Thank you Starxproperties for providing me my dream home within my budget."
              }
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-100 rounded-[20px] p-8 relative group hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:border-[#D4AF37]/30 transition-all duration-500 overflow-hidden flex flex-col"
              >
                {/* Subtle gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Avatar top right */}
                <div className="absolute top-8 right-8 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center font-bold text-slate-600 border border-gray-100 group-hover:text-[#D4AF37] group-hover:border-[#D4AF37]/50 transition-colors shadow-sm">
                  {review.initials}
                </div>

                <div className="relative z-10 flex flex-col flex-grow">
                  {/* Name */}
                  <h4 className="text-xl font-bold text-slate-900 mb-1 pr-14">{review.name}</h4>
                  
                  {/* Stars */}
                  <div className="flex gap-1 text-[#D4AF37] mb-5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-600 leading-relaxed mb-6 flex-grow font-medium">
                    "{review.text}"
                  </p>

                  {/* Role */}
                  <div className="mt-auto">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-500 transition-colors">
                      {review.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
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