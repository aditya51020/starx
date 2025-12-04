// src/pages/Wishlist.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, X, Home, MapPin, Bed, Bath, Maximize } from 'lucide-react';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Load wishlist IDs from localStorage
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(saved);

    // Fetch full property details
    if (saved.length > 0) {
      fetch(`/api/properties?wishlist=${saved.join(',')}`)
        .then(res => res.json())
        .then(data => {
          const props = data.data || data || [];
          setProperties(Array.isArray(props) ? props : []);
        })
        .catch(err => {
          console.error('Failed to load wishlist properties', err);
          setProperties([]);
        });
    }
  }, []);

  const removeFromWishlist = (propertyId) => {
    const newWishlist = wishlist.filter(id => id !== propertyId);
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    setProperties(prev => prev.filter(p => p._id !== propertyId));
  };

  const clearAll = () => {
    setWishlist([]);
    setProperties([]);
    localStorage.removeItem('wishlist');
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h1>
            <p className="text-xl text-gray-600 mb-8">
              Start adding properties you love by clicking the heart icon!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 bg-rose-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-rose-700 transition shadow-lg"
            >
              <Home className="w-5 h-5" />
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              My Wishlist
            </h1>
            <p className="text-xl text-gray-600 mt-2">{wishlist.length} Properties Saved</p>
          </div>
          <button
            onClick={clearAll}
            className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-2 transition"
          >
            <X className="w-5 h-5" />
            Clear All
          </button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(property => (
            <div
              key={property._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition group"
            >
              <Link to={`/property/${property._id}`} className="block">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.images?.[0] || '/placeholder.jpg'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {property.title}
                  </h3>
                  <p className="text-3xl font-bold text-rose-600 mb-3">
                    ₹{property.price?.toLocaleString('en-IN')}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4" />
                    {property.region}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Bed className="w-4 h-4" /> {property.bhk} BHK
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" /> {property.bathrooms || property.bhk}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" /> {property.area} sqft
                    </span>
                  </div>
                </div>
              </Link>

              {/* Remove Button */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => removeFromWishlist(property._id)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}