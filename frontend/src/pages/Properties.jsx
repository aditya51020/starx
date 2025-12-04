// src/pages/Properties.jsx - ENHANCED WITH AIRBNB STYLE
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, Filter, Grid, List, ChevronDown, X, Heart,
  MapPin, Bed, Bath, Maximize, TrendingUp, Home as HomeIcon,
  SlidersHorizontal, ArrowUpDown, Sparkles
} from 'lucide-react';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [wishlist, setWishlist] = useState([]);

  const [filters, setFilters] = useState({
    region: searchParams.get('region') || '',
    transactionType: searchParams.get('transactionType') || '',
    propertyType: searchParams.get('propertyType') || '',
    bhk: searchParams.get('bhk') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    furnishing: searchParams.get('furnishing') || '',
    sort: searchParams.get('sort') || 'latest'
  });

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(savedWishlist);
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });

        const res = await axios.get(`/api/properties?${params.toString()}`);

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
      sort: 'latest'
    });
    setSearchParams({});
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'latest').length;

  // Filter Section Component
  const FilterSection = ({ isMobile = false }) => (
    <div className="space-y-6">
      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📍 Location
        </label>
        <select
          value={filters.region}
          onChange={(e) => setFilters({ ...filters, region: e.target.value })}
          onBlur={updateUrl}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          <option value="">All Locations</option>
          <option value="Vasundhara">Vasundhara</option>
          <option value="Indirapuram">Indirapuram</option>
          <option value="Sector 63">Sector 63</option>
        </select>
      </div>

      {/* Transaction Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          🏠 Property For
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['', 'Rent', 'Sell'].map((type) => (
            <button
              key={type || 'all'}
              onClick={() => {
                setFilters({ ...filters, transactionType: type });
                setTimeout(updateUrl, 100);
              }}
              className={`py-2 px-3 rounded-lg font-medium text-sm transition ${filters.transactionType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {type || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          🏢 Property Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['', 'Apartment', 'Villa', 'House', 'Plot'].map((type) => (
            <button
              key={type || 'all'}
              onClick={() => {
                setFilters({ ...filters, propertyType: type });
                setTimeout(updateUrl, 100);
              }}
              className={`py-2 px-3 rounded-lg font-medium text-sm transition ${filters.propertyType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {type || 'All Types'}
            </button>
          ))}
        </div>
      </div>

      {/* BHK */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          🛏️ BHK Configuration
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['', '1', '2', '3', '4', '5'].map((bhk) => (
            <button
              key={bhk || 'all'}
              onClick={() => {
                setFilters({ ...filters, bhk });
                setTimeout(updateUrl, 100);
              }}
              className={`py-2 px-3 rounded-lg font-medium text-sm transition ${filters.bhk === bhk
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {bhk ? `${bhk} BHK` : 'Any'}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          💰 Price Range
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="number"
              placeholder="₹ Min"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              onBlur={updateUrl}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="₹ Max"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              onBlur={updateUrl}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Furnishing */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          🪑 Furnishing Status
        </label>
        <select
          value={filters.furnishing}
          onChange={(e) => setFilters({ ...filters, furnishing: e.target.value })}
          onBlur={updateUrl}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="Furnished">Furnished</option>
          <option value="Semi-Furnished">Semi-Furnished</option>
          <option value="Unfurnished">Unfurnished</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 space-y-3">
        <button
          onClick={updateUrl}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
        >
          Apply Filters
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Clear All Filters ({activeFilterCount})
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Premium Properties</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            All Properties in Ghaziabad
          </h1>
          <p className="text-xl opacity-90 mb-6">
            Found <span className="font-bold">{total}</span> properties matching your search
          </p>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {filters.region && (
                <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm">
                  📍 {filters.region}
                </span>
              )}
              {filters.transactionType && (
                <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm">
                  🏠 {filters.transactionType}
                </span>
              )}
              {filters.propertyType && (
                <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm">
                  🏢 {filters.propertyType}
                </span>
              )}
              {filters.bhk && (
                <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm">
                  🛏️ {filters.bhk} BHK
                </span>
              )}
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
                  <SlidersHorizontal className="w-6 h-6 text-blue-600" />
                  Filters
                </h3>
                {activeFilterCount > 0 && (
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
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
                  Showing <span className="font-bold text-blue-600">{properties.length}</span> of <span className="font-bold">{total}</span> results
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
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-blue-700 transition"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Property Grid/List */}
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-gray-200 h-96 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <HomeIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Properties Found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to see more results</p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {properties.map(property => (
                  <Link
                    key={property._id}
                    to={`/property/${property._id}`}
                    className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 ${viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'
                      }`}
                  >
                    {/* Image */}
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-80 h-64' : 'h-64 w-full'}`}>
                      <img
                        src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${property.transactionType === 'Rent'
                          ? 'bg-green-500'
                          : property.transactionType === 'Sold'
                            ? 'bg-gray-500'
                            : 'bg-blue-500'
                          }`}>
                          {property.transactionType}
                        </span>

                        {property.featured && (
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            ⭐ Featured
                          </span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => toggleWishlist(property._id, e)}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition shadow-lg z-10"
                      >
                        <Heart
                          className={`w-5 h-5 ${wishlist.includes(property._id)
                            ? 'fill-blue-500 text-blue-500'
                            : 'text-gray-600'
                            }`}
                        />
                      </button>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition">
                        {property.title}
                      </h3>

                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                        {property.region}
                      </div>

                      <div className="flex items-baseline gap-2 mb-4">
                        <p className="text-3xl font-bold text-gray-900">
                          ₹{property.price?.toLocaleString('en-IN') || 'N/A'}
                        </p>
                        {property.transactionType === 'Rent' && (
                          <span className="text-gray-500 text-sm">/month</span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{property.bhk} BHK</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{property.bathrooms || property.bhk} Bath</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                          <Maximize className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{property.area} sqft</span>
                        </div>
                      </div>

                      {property.furnishing && (
                        <div className="mt-3">
                          <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                            🪑 {property.furnishing}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Load More Button (Optional) */}
            {properties.length < total && (
              <div className="text-center mt-12">
                <button className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition">
                  Load More Properties
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-6 h-6 text-blue-600" />
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