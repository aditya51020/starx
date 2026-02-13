// src/pages/Properties.jsx - ENHANCED WITH AIRBNB STYLE & MAP & COMPARE
import { useEffect, useState } from 'react';
import api from '../axiosConfig';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, Filter, Grid, List, ChevronDown, X, Heart,
  MapPin, Bed, Bath, Maximize, TrendingUp, Home as HomeIcon,
  SlidersHorizontal, ArrowUpDown, Sparkles, Check, Map as MapIcon, Plus, Building2, Sofa, CreditCard, Star
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Helmet } from 'react-helmet-async';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PropertyCardSkeleton from '../components/common/PropertyCardSkeleton'; // Import Skeleton

import LoginModal from '../components/common/LoginModal'; // Import LoginModal
import PriceRangeDropdown from '../components/common/PriceRangeDropdown'; // Import PriceRangeDropdown

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // Login Modal State
  const [viewMode, setViewMode] = useState('grid'); // grid, list, map
  const [wishlist, setWishlist] = useState([]);

  const { addToCompare, compareList } = useCompare();
  const { user } = useAuth(); // If we want server-side wishlist later

  const [filters, setFilters] = useState({
    region: searchParams.get('region') || '',
    transactionType: searchParams.get('transactionType') || '',
    propertyType: searchParams.get('propertyType') || '',
    bhk: searchParams.get('bhk') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    furnishing: searchParams.get('furnishing') || '',
    amenities: searchParams.get('amenities') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'latest'
  });

  useEffect(() => {
    // Load wishlist from localStorage (Legacy)
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    // Ideally merge with user.wishlist if logged in
    setWishlist(savedWishlist);
  }, [user]);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });

        const res = await api.get(`/api/properties?${params.toString()}`);

        const data = res.data?.data || res.data?.properties || res.data || [];
        const totalCount = res.data?.total || res.data?.count || data.length || 0;

        setProperties(Array.isArray(data) ? data : []);
        setTotal(totalCount);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setProperties([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

  const toggleWishlist = (propertyId, e) => {
    e.preventDefault();
    e.stopPropagation();

    const newWishlist = wishlist.includes(propertyId)
      ? wishlist.filter(id => id !== propertyId)
      : [...wishlist, propertyId];

    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    // TODO: Sync with backend if user is logged in
    if (user) {
      toast.success(wishlist.includes(propertyId) ? 'Removed from Wishlist' : 'Added to Wishlist');
    }
  };

  const updateUrl = () => {
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      region: '',
      transactionType: '',
      propertyType: '',
      bhk: '',
      minPrice: '',
      maxPrice: '',
      furnishing: '',
      amenities: '',
      search: '',
      sort: 'latest'
    });
    setSearchParams({});
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'latest').length;

  // Custom Dropdown Component
  const CustomDropdown = ({ label, icon: Icon, value, options, onChange, placeholder = "Select" }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl flex items-center justify-between hover:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition group"
        >
          <div className="flex items-center gap-2 text-gray-700">
            {Icon && <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#D4AF37] transition" />}
            <span className={value ? "font-medium" : "text-gray-500"}>
              {value || placeholder}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            ></div>
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-1">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-between ${value === opt.value
                      ? 'bg-[#FFFDF0] text-[#D4AF37]'
                      : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {opt.label}
                    {value === opt.value && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Price Range Dropdown Component by StarX
  const PriceRangeDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isRent = filters.transactionType === 'Rent';

    // Price Options
    const rentOptions = [
      { val: 5000, label: '₹ 5 Thousand' },
      { val: 10000, label: '₹ 10 Thousand' },
      { val: 15000, label: '₹ 15 Thousand' },
      { val: 20000, label: '₹ 20 Thousand' },
      { val: 25000, label: '₹ 25 Thousand' },
      { val: 30000, label: '₹ 30 Thousand' },
      { val: 40000, label: '₹ 40 Thousand' },
      { val: 50000, label: '₹ 50 Thousand' },
      { val: 75000, label: '₹ 75 Thousand' },
      { val: 100000, label: '₹ 1 Lakh' },
    ];

    const sellOptions = [
      { val: 2000000, label: '₹ 20 Lakh' },
      { val: 4000000, label: '₹ 40 Lakh' },
      { val: 6000000, label: '₹ 60 Lakh' },
      { val: 8000000, label: '₹ 80 Lakh' },
      { val: 10000000, label: '₹ 1 Cr' },
      { val: 15000000, label: '₹ 1.5 Cr' },
      { val: 20000000, label: '₹ 2 Cr' },
      { val: 30000000, label: '₹ 3 Cr' },
      { val: 50000000, label: '₹ 5 Cr' },
    ];

    const options = isRent ? rentOptions : sellOptions;

    // Helper to format display value
    const formatPrice = (val) => {
      if (!val) return '';
      if (val >= 10000000) return `₹${val / 10000000} Cr`;
      if (val >= 100000) return `₹${val / 100000} L`;
      if (val >= 1000) return `₹${val / 1000} K`;
      return `₹${val}`;
    };

    const displayText = filters.minPrice || filters.maxPrice
      ? `${formatPrice(filters.minPrice) || 'Min'} - ${formatPrice(filters.maxPrice) || 'Max'}`
      : 'Budget';

    return (
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#D4AF37]" /> Budget
        </label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl flex items-center justify-between hover:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition group text-left"
        >
          <span className={filters.minPrice || filters.maxPrice ? "font-medium text-gray-900" : "text-gray-500"}>
            {displayText}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            ></div>
            <div className="absolute z-20 w-[300px] mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 p-0">
              <div className="flex border-b border-gray-100 bg-gray-50">
                <div className="flex-1 p-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-r">Min</div>
                <div className="flex-1 p-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Max</div>
              </div>
              <div className="flex max-h-64">
                {/* Min Column */}
                <div className="flex-1 overflow-y-auto border-r border-gray-100">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, minPrice: '' }))}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${!filters.minPrice ? 'text-[#D4AF37] font-bold bg-[#FFFDF0]' : 'text-gray-700'}`}
                  >
                    Min
                  </button>
                  {options.map(opt => (
                    <button
                      key={`min-${opt.val}`}
                      onClick={() => setFilters(prev => ({ ...prev, minPrice: opt.val }))}
                      disabled={filters.maxPrice && opt.val >= filters.maxPrice} // Disable if > max
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${Number(filters.minPrice) === opt.val ? 'text-[#D4AF37] font-bold bg-[#FFFDF0]' : 'text-gray-700'} disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Max Column */}
                <div className="flex-1 overflow-y-auto">
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, maxPrice: '' }));
                      setIsOpen(false);
                      setTimeout(updateUrl, 100);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${!filters.maxPrice ? 'text-[#D4AF37] font-bold bg-[#FFFDF0]' : 'text-gray-700'}`}
                  >
                    Max
                  </button>
                  {options.map(opt => (
                    <button
                      key={`max-${opt.val}`}
                      onClick={() => {
                        setFilters(prev => ({ ...prev, maxPrice: opt.val }));
                        setIsOpen(false);
                        setTimeout(updateUrl, 100);
                      }}
                      disabled={filters.minPrice && opt.val <= filters.minPrice} // Disable if < min
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${Number(filters.maxPrice) === opt.val ? 'text-[#D4AF37] font-bold bg-[#FFFDF0]' : 'text-gray-700'} disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Checkbox Group Component for Amenities
  const CheckboxGroup = ({ label, options, selected, onChange }) => (
    <div>
      <label className="block text-sm font-bold text-gray-900 mb-3">
        {label}
      </label>
      <div className="space-y-2">
        {options.map((opt) => {
          const isSelected = selected.split(',').includes(opt);
          return (
            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${isSelected ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-300 bg-white group-hover:border-[#D4AF37]'}`}>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={isSelected}
                onChange={() => {
                  let current = selected ? selected.split(',') : [];
                  if (isSelected) {
                    current = current.filter(a => a !== opt);
                  } else {
                    current.push(opt);
                  }
                  onChange(current.join(','));
                }}
              />
              <span className={`text-sm ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );

  // Filter Section Component - Redesigned
  const FilterSection = ({ isMobile = false }) => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Custom Filter</h3>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline font-medium">
            Clear all
          </button>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-3">Location</label>
        <div className="space-y-2">
          {['Vasundhara', 'Indirapuram', 'Sector 63'].map(loc => (
            <label key={loc} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.region === loc ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-300 bg-white group-hover:border-[#D4AF37]'}`}>
                {filters.region === loc && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <input
                type="radio"
                name="location"
                checked={filters.region === loc}
                onChange={() => {
                  setFilters({ ...filters, region: loc });
                  setTimeout(updateUrl, 100);
                }}
                className="hidden"
              />
              <span className={`text-sm ${filters.region === loc ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{loc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-3">Price Range</label>
        <PriceRangeDropdown filters={filters} setFilters={setFilters} updateUrl={updateUrl} />
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-3">Type Of Place</label>
        <div className="space-y-2">
          {['Apartment', 'Villa', 'House', 'Plot'].map(type => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${filters.propertyType === type ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-300 bg-white group-hover:border-[#D4AF37]'}`}>
                {filters.propertyType === type && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <input
                type="radio"
                name="propertyType"
                checked={filters.propertyType === type}
                onChange={() => {
                  setFilters({ ...filters, propertyType: type });
                  setTimeout(updateUrl, 100);
                }}
                className="hidden"
              />
              <span className={`text-sm ${filters.propertyType === type ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Transaction Type */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-3">Looking For</label>
        <div className="flex gap-2">
          {['Rent', 'Sell'].map(type => (
            <button
              key={type}
              onClick={() => {
                setFilters({ ...filters, transactionType: filters.transactionType === type ? '' : type });
                setTimeout(updateUrl, 100);
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${filters.transactionType === type ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#D4AF37]'}`}
            >
              {type === 'Sell' ? 'Buy' : type}
            </button>
          ))}
        </div>
      </div>


      {/* Amenities */}
      <CheckboxGroup
        label="Amenities"
        options={['Parking', 'Gym', 'Swimming Pool', 'Security', 'Lift', 'WiFi']}
        selected={filters.amenities}
        onChange={(val) => {
          setFilters({ ...filters, amenities: val });
          setTimeout(updateUrl, 100);
        }}
      />

      {/* Mobile Apply Button */}
      {isMobile && (
        <button
          onClick={() => setShowMobileFilters(false)}
          className="w-full bg-[#D4AF37] text-white py-3 rounded-xl font-bold mt-4"
        >
          View Properties
        </button>
      )}

    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>All Properties | StartxProperties - Buy, Sell, Rent in Ghaziabad</title>
        <meta name="description" content="Browse our extensive list of properties in Vasundhara, Indirapuram, and Sector 63. Find your perfect home or investment opportunity." />
      </Helmet>
      {/* Hero Section - Redesigned Light Theme */}
      <div className="bg-white pt-24 pb-12 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#FFFDF0] border border-[#D4AF37]/20 text-[#D4AF37] px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-wider">Premium Properties</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Find Your Dream Home <br className="hidden md:block" /> in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B5952F]">Ghaziabad</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Explore <span className="font-bold text-gray-900">{total}</span> premium properties in Vasundhara, Indirapuram, and Sector 63.
          </p>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {filters.region && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {filters.region}
                </span>
              )}
              {filters.transactionType && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <HomeIcon className="w-3.5 h-3.5" /> {filters.transactionType}
                </span>
              )}
              {filters.propertyType && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> {filters.propertyType}
                </span>
              )}
              {filters.bhk && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5" /> {filters.bhk} BHK
                </span>
              )}
              <button
                onClick={clearFilters}
                className="hover:bg-red-50 text-red-500 px-3 py-1 rounded-full text-sm font-medium transition flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-6 h-6 text-[#D4AF37]" />
                  Filters
                </h3>
                {activeFilterCount > 0 && (
                  <span className="bg-[#FFFDF0] text-[#D4AF37] px-3 py-1 rounded-full text-sm font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>

              <FilterSection />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Action Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <p className="text-gray-700 font-medium">
                  Showing <span className="font-bold text-[#D4AF37]">{properties.length}</span> of <span className="font-bold">{total}</span> results
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={filters.sort}
                    onChange={(e) => {
                      setFilters({ ...filters, sort: e.target.value });
                      setTimeout(updateUrl, 100);
                    }}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-[#D4AF37] bg-white"
                  >
                    <option value="latest">Latest First</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                  </select>
                  <ArrowUpDown className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-500'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-500'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-2 rounded ${viewMode === 'map' ? 'bg-white shadow' : 'text-gray-500'}`}
                  >
                    <MapIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden bg-[#D4AF37] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-[#C5A059] transition"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-white text-[#D4AF37] px-2 py-0.5 rounded-full text-xs font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Property Grid/List/Map */}
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <HomeIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Properties Found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to see more results</p>
                <button
                  onClick={clearFilters}
                  className="bg-[#D4AF37] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C5A059] transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'map' ? (
              // MAP VIEW
              <div className="h-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative z-0">
                <MapContainer
                  center={[28.6692, 77.4538]}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  {properties.map(property => (
                    (property.lat && property.lng) ? (
                      <Marker
                        key={property.id}
                        position={[property.lat, property.lng]}
                      >
                        <Popup>
                          <div className="w-48">
                            <img src={property.images?.[0]} alt={property.title} className="w-full h-24 object-cover rounded mb-2" />
                            <h4 className="font-bold text-sm truncate">{property.title}</h4>
                            <p className="text-[#D4AF37] font-bold">₹{property.price?.toLocaleString('en-IN')}</p>
                            <Link to={`/property/${property.id}`} className="block mt-2 text-center bg-[#D4AF37] text-white py-1 rounded text-xs">View Details</Link>
                          </div>
                        </Popup>
                      </Marker>
                    ) : null
                  ))}
                </MapContainer>
              </div>
            ) : (
              // GRID / LIST VIEW
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                {properties.map(property => (
                  <div
                    key={property.id}
                    className={`group relative rounded-[2rem] overflow-hidden transition-all duration-300 ${viewMode === 'list' ? 'flex flex-row h-64' : 'aspect-[4/5] w-full'
                      }`}
                  >
                    <Link to={`/property/${property.id}`} className="absolute inset-0 z-10"></Link>

                    {/* Full Background Image */}
                    <img
                      src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                      alt={property.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Gradient Overlay for visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none"></div>

                    {/* Top Badges */}
                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20 pointer-events-none">
                      {/* Type Badge */}
                      {property.propertyType && (
                        <span className="bg-white/95 backdrop-blur-md text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border border-gray-100">
                          {property.propertyType}
                        </span>
                      )}

                      {/* Status Badge */}
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm ${property.transactionType === 'Rent'
                        ? 'bg-[#10B981]' // Green for Rent
                        : property.transactionType === 'Sell'
                          ? 'bg-[#3B82F6]' // Blue for Sell
                          : 'bg-gray-500'
                        }`}>
                        {property.transactionType}
                      </span>
                    </div>

                    {/* Floating Bottom Info Card */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white rounded-[1.5rem] p-4 shadow-xl z-20 mx-auto border border-gray-100 pointer-events-none">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0 mr-2">
                          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition">
                            {property.title}
                          </h3>
                          <div className="flex items-center text-gray-500 text-xs mt-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{property.region}</span>
                          </div>
                        </div>

                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => toggleWishlist(property._id || property.id, e)}
                          className="bg-blue-50 p-2.5 rounded-full hover:bg-blue-100 transition flex-shrink-0 group/btn shadow-sm pointer-events-auto"
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors ${wishlist.includes(property._id || property.id) ? 'fill-[#3B82F6] text-[#3B82F6]' : 'text-[#3B82F6]'}`}
                          />
                        </button>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-baseline">
                          <span className="text-xl font-extrabold text-gray-900">
                            ₹{property.price?.toLocaleString('en-IN') || 'N/A'}
                          </span>
                          {property.transactionType === 'Rent' && (
                            <span className="text-gray-400 text-xs ml-1 font-medium">/month</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-bold text-gray-700">4.8</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load More Button (Optional) */}
                {properties.length < total && viewMode !== 'map' && (
                  <div className="text-center mt-12">
                    <button
                      onClick={() => {
                        if (!user) {
                          setShowLoginModal(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' }); // Optional: scroll up slightly or keep position
                        } else {
                          // Logic to load more properties (e.g., pagination)
                          // For now just console log or toast that we would load more
                          toast('Loading more properties...', { icon: '⏳' });
                        }
                      }}
                      className="bg-white border-2 border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-xl font-bold hover:bg-[#FFFDF0] transition"
                    >
                      Load More Properties
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-6 h-6 text-[#D4AF37]" />
                Filters
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <FilterSection isMobile={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}