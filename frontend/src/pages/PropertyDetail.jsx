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
  const [showFullDescription, setShowFullDescription] = useState(false);
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
          <Link to="/properties" className="inline-flex items-center gap-2 text-[#D4AF37] hover:underline text-lg">
            <ChevronLeft className="w-5 h-5" /> Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const phone = "9212153683"; // Forced as per user request
  const coordinates = property.lat && property.lng ? [property.lat, property.lng] : [28.6692, 77.4538];

  return (
    <div className="min-h-screen bg-white pt-24">
      <Meta
        title={property.title}
        description={property.description || `Beautiful ${property.bhk} BHK property via StarX Realty.`}
        image={property.images?.[0]}
        url={window.location.href}
      />
      {/* Main Content - Split Hero Layout */}
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column - Large Hero Image (65%) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Large Hero Image */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[350px] md:h-[450px] group">
              {property.images?.[0]?.match(/\.(mp4|webm|mov)$/i) ? (
                <video
                  src={property.images[0]}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <img
                  src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'}
                  alt={property.title}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-700"
                  onClick={() => setShowAllPhotos(true)}
                />
              )}
              {/* View All Photos Button Overlay */}
              <button
                onClick={() => setShowAllPhotos(true)}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl font-bold shadow-lg hover:bg-white transition flex items-center gap-2 text-gray-900 text-sm"
              >
                <Building2 className="w-4 h-4" />
                Show all {property.images?.length || 0} photos
              </button>
            </div>

            {/* Description & Details (Below Image) */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">About this property</h2>
                <div className="relative">
                  <p className={`text-gray-600 leading-relaxed whitespace-pre-line ${!showFullDescription ? 'line-clamp-4' : ''}`}>
                    {property.description || `Beautiful and spacious ${property.bhk} BHK ${property.transactionType === 'Rent' ? 'apartment for rent' : 'property for sale'} in ${property.region}, Ghaziabad. This well-maintained property offers modern amenities and is ready to move in. Located in a prime area with excellent connectivity to major landmarks, schools, hospitals, and shopping centers.`}
                  </p>
                  {(property.description?.length > 300 || !property.description) && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-1 text-[#D4AF37] font-semibold hover:underline flex items-center gap-1 text-sm"
                    >
                      {showFullDescription ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Property Features Grid */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-0.5">Type</p>
                    <p className="font-bold text-gray-900 text-base">{property.propertyType || 'Apartment'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-0.5">Furnishing</p>
                    <p className="font-bold text-gray-900 text-base">{property.furnishing || 'Semi-Furnished'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-0.5">Area</p>
                    <p className="font-bold text-gray-900 text-base">{property.area} sqft</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-0.5">Status</p>
                    <p className="font-bold text-gray-900 text-base">{property.transactionType}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-0.5">Bedrooms</p>
                    <p className="font-bold text-gray-900 text-base">{property.bhk} BHK</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-0.5">Bathrooms</p>
                    <p className="font-bold text-gray-900 text-base">{property.bathrooms || property.bhk}</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, i) => {
                      const cleanName = amenity.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]/gu, '').trim();
                      const IconComponent = amenityIcons[cleanName] || amenityIcons[amenity] || Check;
                      return (
                        <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition border border-gray-100">
                          <div className="w-8 h-8 bg-[#FFFDF0] rounded-full flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-4 h-4 text-[#D4AF37]" />
                          </div>
                          <span className="font-bold text-gray-800 text-sm">{cleanName}</span>
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
                <h2 className="text-xl font-bold text-gray-900 mb-3">Location</h2>
                <div className="rounded-[1.5rem] overflow-hidden border border-gray-200 shadow-lg h-[300px]">
                  <MapContainer center={coordinates} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />
                    <Marker position={coordinates}>
                      <Popup>
                        <div className="text-center p-2">
                          <h3 className="font-bold">{property.title}</h3>
                          <p className="text-[#D4AF37] font-semibold">₹{property.price?.toLocaleString('en-IN')}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>

                {/* Nearby Places Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {(() => {
                    const places = typeof property.nearbyPlaces === 'string'
                      ? JSON.parse(property.nearbyPlaces)
                      : (property.nearbyPlaces || {});

                    return (
                      <>
                        <div className="p-3 bg-[#FFFDF0] rounded-xl border border-[#D4AF37]/20 text-center">
                          <Train className="w-6 h-6 text-[#D4AF37] mx-auto mb-1" />
                          <p className="text-xs font-bold text-gray-900">Metro</p>
                          <p className="text-[10px] text-gray-600">{places.metro || '0'} km</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                          <Hospital className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                          <p className="text-xs font-bold text-gray-900">Hospital</p>
                          <p className="text-[10px] text-gray-600">{places.hospital || '0'} km</p>
                        </div>
                        <div className="p-3 bg-[#FFFDF0] rounded-xl border border-[#D4AF37]/20 text-center">
                          <School className="w-6 h-6 text-[#D4AF37] mx-auto mb-1" />
                          <p className="text-xs font-bold text-gray-900">School</p>
                          <p className="text-[10px] text-gray-600">{places.school || '0'} km</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                          <ShoppingCart className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                          <p className="text-xs font-bold text-gray-900">Mall</p>
                          <p className="text-[10px] text-gray-600">{places.market || '0'} km</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column - Sticky Info & Booking (35%) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">

              {/* Main Info Card - Compact */}
              <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-6">
                {/* Address & Title */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{property.region}, Ghaziabad</p>
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">{property.title}</h1>
                  <div className="flex items-center gap-1.5 text-[#D4AF37]">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-base">4.9</span>
                    <span className="text-gray-400 text-xs">(120 reviews)</span>
                  </div>
                </div>

                {/* Key Stats Row */}
                <div className="flex justify-between items-center py-4 border-t border-b border-gray-100 mb-4">
                  <div className="text-center">
                    <span className="block text-xl font-bold text-gray-900">{property.bhk}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Beds</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center">
                    <span className="block text-xl font-bold text-gray-900">{property.bathrooms || property.bhk}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Baths</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center">
                    <span className="block text-xl font-bold text-gray-900">{property.area}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Sqft</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <p className="text-gray-500 font-medium mb-0.5 text-sm">
                    {property.transactionType === 'Rent' ? 'Monthly Rent' : 'Total Price'}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
                      ₹{property.price?.toLocaleString('en-IN')}
                    </span>
                    {property.transactionType === 'Rent' && (
                      <span className="text-lg text-gray-400 font-medium">/mo</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => document.getElementById('inquiryForm').scrollIntoView({ behavior: 'smooth' })}
                    className="w-full bg-black text-white py-3 rounded-xl font-bold text-base hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2"
                  >
                    Request a tour <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={shareProperty}
                    className="w-full bg-white border border-gray-200 text-gray-900 py-3 rounded-xl font-bold text-base hover:bg-gray-50 transition flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" /> Share Property
                  </button>
                </div>
              </div>

              {/* Agent Card */}
              <div className="bg-white rounded-[1.5rem] shadow-lg border border-gray-100 p-4 flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C5A059] rounded-full flex items-center justify-center text-white font-bold text-lg ring-2 ring-white shadow-md">
                    SP
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-3.5 h-3.5 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <p className="font-bold text-base text-gray-900">StarX Properties</p>
                  <p className="text-green-600 text-xs font-semibold">Verified Agent • Online</p>
                </div>
                <button className="ml-auto text-blue-600 font-bold text-xs hover:underline bg-blue-50 px-3 py-1 rounded-full">Contact</button>
              </div>

              {/* Inquiry Form (Simplified for Side Panel) */}
              <div id="inquiryForm" className="bg-gray-50 rounded-[2rem] p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Interested? Get in touch</h3>
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent font-medium"
                    value={inquiryForm.name}
                    onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent font-medium"
                    value={inquiryForm.email}
                    onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent font-medium"
                    value={inquiryForm.phone}
                    onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  />
                  <textarea
                    placeholder="Message"
                    required
                    rows="3"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent font-medium resize-none"
                    value={inquiryForm.message}
                    onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  ></textarea>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#D4AF37] text-white py-3 rounded-xl font-bold hover:bg-[#C5A059] transition shadow-md"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
                <div className="flex gap-2 mt-3">
                  <a href={`tel:${phone}`} className="flex-1 bg-white border border-gray-200 py-2 rounded-lg text-center font-bold text-gray-700 hover:bg-gray-50 transition">Call</a>
                  <a href={`https://wa.me/91${phone.replace(/\D/g, '')}`} className="flex-1 bg-[#25D366]/10 border border-[#25D366]/20 py-2 rounded-lg text-center font-bold text-[#25D366] hover:bg-[#25D366]/20 transition">WhatsApp</a>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Similar Properties</h2>
              <Link to="/properties" className="text-[#D4AF37] hover:text-[#C5A059] font-semibold flex items-center gap-1">
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
                    <p className="text-3xl font-bold text-[#D4AF37] mb-2">
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
        <div className="fixed inset-0 bg-black z-[3000] overflow-y-auto">
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
            <div className="container mx-auto px-4 py-8 h-full flex flex-col justify-center">
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:grid md:grid-cols-2 md:overflow-visible no-scrollbar pb-4 md:pb-0 items-center">
                {property.images?.map((img, i) => (
                  <div key={i} className="relative group flex-shrink-0 w-full md:w-auto snap-center flex items-center justify-center bg-black/50 rounded-2xl p-2 h-[80vh] md:h-auto">
                    {img.match(/\.(mp4|webm|mov)$/i) ? (
                      <video
                        src={img}
                        className="max-w-full max-h-full w-auto h-auto rounded-xl shadow-2xl mx-auto object-contain"
                        controls
                      />
                    ) : (
                      <img
                        src={img}
                        alt={`Photo ${i + 1}`}
                        className="max-w-full max-h-full w-auto h-auto rounded-xl shadow-2xl mx-auto object-contain"
                      />
                    )}
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-md">
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