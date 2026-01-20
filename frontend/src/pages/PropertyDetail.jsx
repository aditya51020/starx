// src/pages/PropertyDetail.jsx - ENHANCED AIRBNB STYLE
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../axiosConfig';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  Heart, Share2, MapPin, Bed, Bath, Maximize, Home,
  Car, School, Train, ShoppingCart, Phone, MessageCircle,
  ChevronLeft, Star, Calculator, ArrowRight, Wifi, Wind,
  Shield, Dumbbell, WashingMachine, Sofa,
  Zap, Check, X as XIcon, Users, Building2,
  Trees, Hospital, ChevronRight
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Meta from '../components/Meta'; // Import Meta component
// eslint-disable-next-line no-unused-vars
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useAuth(); // Get user from context
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showEMI, setShowEMI] = useState(false);
  const [emiResult, setEmiResult] = useState(null);

  // Inquiry Form State
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setInquiryForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '' // Assuming we might add phone to user later
      }));
    }
  }, [user]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/inquiries', {
        ...inquiryForm,
        propertyId: id
      });
      toast.success('Inquiry sent successfully! We will contact you soon.');
      setInquiryForm({ name: user?.name || '', email: user?.email || '', phone: '', message: '' });
    } catch (err) {
      toast.error('Failed to send inquiry. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Amenity icon mapping
  const amenityIcons = {
    'Parking': Car,
    'Gym': Dumbbell,
    'Swimming Pool': Building2,
    'Security': Shield,
    'Lift': ArrowRight,
    'Power Backup': Zap,
    'Garden': Trees,
    'Club House': Users,
    'WiFi': Wifi,
    'AC': Wind,
    'Modular Kitchen': Sofa,
    'Washing Machine': WashingMachine,
  };

  useEffect(() => {
    // Load wishlist
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(saved);

    // Track recently viewed
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (!viewed.includes(id)) {
      viewed.unshift(id);
      localStorage.setItem('recentlyViewed', JSON.stringify(viewed.slice(0, 10)));
    }

    const fetchProperty = async () => {
      try {
        const [propRes, similarRes] = await Promise.all([
          api.get(`/api/properties/${id}`),
          api.get(`/api/properties?limit=6`)
        ]);

        const data = propRes.data?.data || propRes.data || null;
        setProperty(data);

        const similarData = similarRes.data?.data || similarRes.data || [];
        const filtered = Array.isArray(similarData)
          ? similarData.filter(p => p.id !== id && p.region === data?.region)
          : [];
        setSimilar(filtered);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const toggleWishlist = () => {
    if (!property) return;
    const newWishlist = wishlist.includes(property.id)
      ? wishlist.filter(w => w !== property.id)
      : [...wishlist, property.id];
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const shareProperty = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ₹${property.price?.toLocaleString('en-IN')}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const calculateEMI = (principal, rate, years) => {
    const monthlyRate = rate / (12 * 100);
    const months = years * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    setEmiResult({
      monthly: Math.round(emi),
      total: Math.round(emi * months),
      interest: Math.round((emi * months) - principal)
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-200 rounded-3xl"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-48 bg-gray-200 rounded-2xl"></div>
              <div className="h-48 bg-gray-200 rounded-2xl"></div>
              <div className="h-48 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Property Not Found</h2>
          <Link to="/properties" className="inline-flex items-center gap-2 text-blue-600 hover:underline text-lg">
            <ChevronLeft className="w-5 h-5" /> Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const phone = property.contactPhone || "9958253683";
  const coordinates = property.lat && property.lng ? [property.lat, property.lng] : [28.6692, 77.4538];

  return (
    <div className="min-h-screen bg-white pt-24">
      <Meta
        title={property.title}
        description={property.description || `Beautiful ${property.bhk} BHK property via StarX Realty.`}
        image={property.images?.[0]}
        url={window.location.href}
      />
      {/* Image Gallery */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden">
          {/* Main Large Image */}
          <div className="md:col-span-2 md:row-span-2 relative group">
            <img
              src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'}
              alt={property.title}
              className="w-full h-full object-cover cursor-pointer hover:brightness-95 transition"
              onClick={() => setShowAllPhotos(true)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>
          </div>

          {/* Grid of 4 smaller images */}
          {property.images?.slice(1, 5).map((img, i) => (
            <div key={i} className="relative group cursor-pointer" onClick={() => setShowAllPhotos(true)}>
              <img
                src={img}
                alt={`View ${i + 2}`}
                className="w-full h-full object-cover hover:brightness-95 transition"
                style={{ minHeight: '200px' }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>
            </div>
          ))}

          {/* View All Photos Button */}
          <button
            onClick={() => setShowAllPhotos(true)}
            className="absolute bottom-6 right-6 bg-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition flex items-center gap-2"
          >
            <Building2 className="w-5 h-5" />
            Show all {property.images?.length || 0} photos
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Section */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                      {property.title}
                    </h1>
                    <button onClick={shareProperty} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-xl transition flex-shrink-0 border border-gray-200">
                      <Share2 className="w-5 h-5" />
                      <span className="hidden md:inline font-medium">Share</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      {property.region}, Ghaziabad
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      4.9 (120 reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bed className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{property.bhk}</p>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Bath className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{property.bathrooms || property.bhk}</p>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-blue-50 rounded-full flex items-center justify-center">
                    <Maximize className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{property.area}</p>
                  <p className="text-sm text-gray-600">Sq. Ft.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-indigo-50 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-indigo-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{property.floor || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Floor</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this property</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {property.description || `Beautiful and spacious ${property.bhk} BHK ${property.transactionType === 'Rent' ? 'apartment for rent' : 'property for sale'} in ${property.region}, Ghaziabad. This well-maintained property offers modern amenities and is ready to move in. Located in a prime area with excellent connectivity to major landmarks, schools, hospitals, and shopping centers.`}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Property Features */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Furnishing</p>
                  <p className="font-semibold text-gray-900">{property.furnishing || 'Semi-Furnished'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Property Age</p>
                  <p className="font-semibold text-gray-900">{property.propertyAge || '2-5 years'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Total Floors</p>
                  <p className="font-semibold text-gray-900">{property.totalFloors || 'G+5'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Facing</p>
                  <p className="font-semibold text-gray-900">{property.facing || 'East'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className="font-semibold text-gray-900">{property.transactionType}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Available From</p>
                  <p className="font-semibold text-gray-900">Immediate</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities & Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, i) => {
                    const IconComponent = amenityIcons[amenity] || Check;
                    return (
                      <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Location Map */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Location & Nearby</h2>
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg" style={{ height: '400px' }}>
                <MapContainer center={coordinates} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  <Marker position={coordinates}>
                    <Popup>
                      <div className="text-center p-2">
                        <h3 className="font-bold">{property.title}</h3>
                        <p className="text-blue-600 font-semibold">₹{property.price?.toLocaleString('en-IN')}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              {/* Nearby Places */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <Train className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="text-sm font-semibold text-gray-900">Metro Station</p>
                  <p className="text-xs text-gray-600">0.5 km away</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <Hospital className="w-6 h-6 text-indigo-600 mb-2" />
                  <p className="text-sm font-semibold text-gray-900">Hospital</p>
                  <p className="text-xs text-gray-600">1.2 km away</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <School className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="text-sm font-semibold text-gray-900">School</p>
                  <p className="text-xs text-gray-600">0.8 km away</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <ShoppingCart className="w-6 h-6 text-indigo-600 mb-2" />
                  <p className="text-sm font-semibold text-gray-900">Shopping Mall</p>
                  <p className="text-xs text-gray-600">2.0 km away</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-xl p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{property.price?.toLocaleString('en-IN')}
                    </span>
                    {property.transactionType === 'Rent' && (
                      <span className="text-lg text-gray-600">/month</span>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {property.transactionType === 'Rent' ? 'Monthly Rent' : 'Total Price'}
                  </p>
                </div>

                {/* EMI Calculator Toggle */}
                {property.transactionType !== 'Rent' && (
                  <button
                    onClick={() => setShowEMI(!showEMI)}
                    className="w-full mb-4 flex items-center justify-between p-4 bg-indigo-50 rounded-xl text-indigo-700 font-semibold hover:bg-indigo-100 transition"
                  >
                    <span className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      EMI Calculator
                    </span>
                    <ChevronRight className={`w-5 h-5 transition-transform ${showEMI ? 'rotate-90' : ''}`} />
                  </button>
                )}

                {showEMI && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3">
                    <input
                      type="number"
                      id="emiAmount"
                      placeholder="Loan Amount"
                      defaultValue={property.price}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      id="emiRate"
                      placeholder="Interest Rate (%)"
                      defaultValue="8.5"
                      step="0.1"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      id="emiYears"
                      placeholder="Tenure (Years)"
                      defaultValue="20"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    <button
                      onClick={() => {
                        const amt = parseFloat(document.getElementById('emiAmount').value);
                        const rate = parseFloat(document.getElementById('emiRate').value);
                        const years = parseFloat(document.getElementById('emiYears').value);
                        calculateEMI(amt, rate, years);
                      }}
                      className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold"
                    >
                      Calculate
                    </button>
                    {emiResult && (
                      <div className="mt-3 p-3 bg-white rounded-lg border">
                        <p className="text-sm text-gray-600">Monthly EMI</p>
                        <p className="text-2xl font-bold text-indigo-600">₹{emiResult.monthly.toLocaleString('en-IN')}</p>
                        <div className="mt-2 text-xs text-gray-600">
                          <p>Total: ₹{emiResult.total.toLocaleString('en-IN')}</p>
                          <p>Interest: ₹{emiResult.interest.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <a
                    href={`tel:${phone}`}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:from-green-600 hover:to-green-700 transition shadow-lg text-lg"
                  >
                    <Phone className="w-6 h-6" /> Call Now
                  </a>
                  <a
                    href={`https://wa.me/91${phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:from-green-700 hover:to-green-800 transition shadow-lg text-lg"
                  >
                    <MessageCircle className="w-6 h-6" /> WhatsApp
                  </a>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-800 font-semibold text-center flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Response within 5 minutes
                  </p>
                </div>

                {/* Inquiry Form */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Request a Call Back</h3>
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={inquiryForm.name}
                      onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={inquiryForm.email}
                      onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={inquiryForm.phone}
                      onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    />
                    <textarea
                      placeholder="I'm interested in this property..."
                      rows="3"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={inquiryForm.message}
                      onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    ></textarea>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-blue-400"
                    >
                      {submitting ? 'Sending...' : 'Send Enquiry'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Agent Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold mb-4">Listed by</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    SP
                  </div>
                  <div>
                    <p className="font-bold text-lg">StarX Properties</p>
                    <p className="text-gray-600 flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      4.9 • 200+ reviews
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Trusted real estate agent in Ghaziabad with 10+ years of experience
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Similar Properties</h2>
              <Link to="/properties" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.slice(0, 3).map(p => (
                <Link
                  key={p.id}
                  to={`/property/${p.id}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                      {p.transactionType}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 line-clamp-1">{p.title}</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-2">
                      ₹{p.price?.toLocaleString('en-IN')}
                    </p>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      {p.region}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 pt-3 border-t">
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {p.bhk} BHK
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Maximize className="w-4 h-4" />
                        {p.area} sqft
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Photo Gallery Modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 bg-black z-[1050] overflow-y-auto">
          <div className="min-h-screen">
            {/* Header */}
            <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-10">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h3 className="text-white text-xl font-bold">
                  All Photos ({property.images?.length || 0})
                </h3>
                <button
                  onClick={() => setShowAllPhotos(false)}
                  className="text-white hover:bg-white/10 p-2 rounded-full transition"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Photo Grid */}
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.images?.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-auto rounded-2xl"
                    />
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {i + 1} / {property.images?.length}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}