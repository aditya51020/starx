// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Train, Hospital, School, ShoppingCart, Coffee } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

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
  const [recentlyViewed, setRecentlyViewed] = useState([]);
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
    setRecentlyViewed(savedViewed);

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
        // If savedViewed has items, the 3rd response is recent properties
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
    <div className="min-h-screen bg-white font-sans">
      <Helmet>
        <title>StarX Buildtech – Real Estate & Property Development Company</title>
        <meta name="description" content="StarX Buildtech (also known as Star X or Starx Properties) is a trusted real estate and construction company in Ghaziabad, offering premium properties in Vasundhara, Indirapuram, and Sector 63." />
        <meta name="keywords" content="starx properties, starx buildtech, star x properties, star x buildtech, starx real estate, starx property dealer, starx properties ghaziabad, property dealer in ghaziabad, real estate agent in indirapuram, property consultant in ghaziabad, real estate agent in vasundhara, buy property in indirapuram, commercial property in ghaziabad" />
        <link rel="canonical" href="https://www.starxbuildtech.co.in/" />
      </Helmet>
      <HeroSection
        onSearch={handleSearch}
      />

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

      <MapSection
        allProperties={allProperties}
        nearbyCategories={nearbyCategories}
      />

      {/* Social Proof Marquee */}
      <section className="py-10 bg-gradient-to-r from-gray-900 to-black overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-12 text-white text-lg font-medium">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex gap-12">
              <span> "Found my dream home in Vasundhara!" - Rajesh K.</span>
              <span className="text-[#D4AF37]">•</span>
              <span> "Best property search experience" - Priya S.</span>
              <span className="text-[#D4AF37]">•</span>
              <span> "Highly recommended for Ghaziabad properties" - Amit M.</span>
              <span className="text-[#D4AF37]">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to find your new home?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect property with StarX.
          </p>
          <button
            onClick={() => navigate('/properties')}
            className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-[#D4AF37] hover:text-white transition-all shadow-xl hover:shadow-[#D4AF37]/25 transform hover:-translate-y-1"
          >
            Browse All Properties
          </button>
        </div>
      </section>

      <EMICalculator />
    </div>
  );
}