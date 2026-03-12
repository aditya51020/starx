import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Search, MapPin, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';
// Initialize geocodingClient lazily to avoid top-level crashes if token is empty
const getGeocodingClient = () => {
    if (!MAPBOX_TOKEN) return null;
    try {
        return mbxGeocoding({ accessToken: MAPBOX_TOKEN });
    } catch (e) {
        return null;
    }
};

// Nominatim Fallback for Search
const searchWithNominatim = async (query) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`);
        const data = await response.json();
        return data.map(item => ({
            id: item.place_id,
            text: item.display_name.split(',')[0],
            place_name: item.display_name,
            center: [parseFloat(item.lon), parseFloat(item.lat)]
        }));
    } catch (error) {
        console.error('Nominatim search error:', error);
        return [];
    }
};

// Nominatim Fallback for Reverse Geocoding
const reverseWithNominatim = async (lat, lng) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        return data.display_name || `${lat}, ${lng}`;
    } catch (error) {
        console.error('Nominatim reverse error:', error);
        return `${lat}, ${lng}`;
    }
};

// Component to handle map clicks
function MapEventsHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
}

// Component to handle map view updates
function MapController({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom || map.getZoom(), {
                duration: 1.5
            });
        }
    }, [center, zoom, map]);
    return null;
}

export default function LocationPicker({ form, setForm }) {
    const [position, setPosition] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [tokenError, setTokenError] = useState(false);
    const [mapConfig, setMapConfig] = useState({
        center: [28.6692, 77.4538], // Vasundhara, Ghaziabad
        zoom: 13
    });

    const defaultCenter = [28.6692, 77.4538];

    // Initialize position from form
    useEffect(() => {
        if (form.lat && form.lng) {
            const initialPos = { lat: parseFloat(form.lat), lng: parseFloat(form.lng) };
            setPosition(initialPos);
            setMapConfig({ center: [initialPos.lat, initialPos.lng], zoom: 15 });
        }
    }, []);

    // Reverse geocoding function
    const performReverseGeocode = useCallback(async (lat, lng) => {
        const client = getGeocodingClient();
        if (!client) {
            const fallbackAddress = await reverseWithNominatim(lat, lng);
            setForm(prev => ({ ...prev, address: fallbackAddress, lat, lng }));
            setSearchQuery(fallbackAddress.split(',')[0]);
            return;
        }

        try {
            const response = await client.reverseGeocode({
                query: [lng, lat],
                limit: 1
            }).send();

            if (response && response.body && response.body.features.length > 0) {
                const feature = response.body.features[0];
                const address = feature.place_name;
                setForm(prev => ({ ...prev, address, lat, lng }));
                setSearchQuery(feature.text || address);
            } else {
                throw new Error('No results');
            }
        } catch (error) {
            console.error('Mapbox reverse error, falling back to Nominatim:', error);
            if (error.statusCode === 401) setTokenError(true);
            const fallbackAddress = await reverseWithNominatim(lat, lng);
            setForm(prev => ({ ...prev, address: fallbackAddress, lat, lng }));
            setSearchQuery(fallbackAddress.split(',')[0]);
        }
    }, [setForm]);

    // Handle map click
    const handleMapClick = (latlng) => {
        setPosition(latlng);
        performReverseGeocode(latlng.lat, latlng.lng);
    };

    // Handle marker drag
    const eventHandlers = useMemo(() => ({
        dragend(e) {
            const marker = e.target;
            const latlng = marker.getLatLng();
            setPosition(latlng);
            performReverseGeocode(latlng.lat, latlng.lng);
        },
    }), [performReverseGeocode]);

    // Perform Search
    const executeSearch = async (query = searchQuery) => {
        if (!query.trim() || query.length < 3) return;

        setIsSearching(true);
        setSuggestions([]);
        const client = getGeocodingClient();

        if (!client) {
            const fallbackResults = await searchWithNominatim(query);
            if (fallbackResults.length === 0) {
                toast.error('Location not found');
            } else {
                setSuggestions(fallbackResults);
            }
            setIsSearching(false);
            return;
        }

        try {
            const response = await client.forwardGeocode({
                query: query,
                limit: 5,
                autocomplete: true,
                countries: ['IN']
            }).send();

            if (response.body.features.length === 0) {
                const fallbackResults = await searchWithNominatim(query);
                setSuggestions(fallbackResults);
            } else {
                setSuggestions(response.body.features);
            }
            setTokenError(false);
        } catch (error) {
            // Silence further noise after first fallback trigger
            if (error.statusCode === 401 && !tokenError) {
                console.warn('Mapbox token is 401 Unauthorized. Using Nominatim fallback.');
                setTokenError(true);
            }
            const fallbackResults = await searchWithNominatim(query);
            if (fallbackResults.length === 0) {
                toast.error('Location not found');
            } else {
                setSuggestions(fallbackResults);
            }
        } finally {
            setIsSearching(false);
        }
    };

    // Auto-search on typing (optional suggestions)
    useEffect(() => {
        if (!searchQuery.trim() || searchQuery.length < 5) {
            setSuggestions([]);
            return;
        }
        const timeoutId = setTimeout(() => executeSearch(), 800);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const selectLocation = (feature) => {
        const [lng, lat] = feature.center;
        const newPos = { lat, lng };
        setPosition(newPos);
        setMapConfig({ center: [lat, lng], zoom: 16 });
        setForm(prev => ({
            ...prev,
            lat,
            lng,
            address: feature.place_name
        }));
        setSuggestions([]);
        setSearchQuery(feature.text || feature.place_name);
        toast.success(`Location set to ${feature.text}`);
    };

    const handleManualInput = (e) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value);

        setForm(prev => ({ ...prev, [name]: value }));

        if (!isNaN(numValue)) {
            const newPos = name === 'lat'
                ? { lat: numValue, lng: parseFloat(form.lng || 0) }
                : { lat: parseFloat(form.lat || 0), lng: numValue };

            if (!isNaN(newPos.lat) && !isNaN(newPos.lng)) {
                setPosition(newPos);
                setMapConfig({ center: [newPos.lat, newPos.lng], zoom: 15 });
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                    Property Location
                </label>
            </div>

            {tokenError && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-bold">Mapbox Token Expired/Invalid</p>
                        <p>Falling back to open search. Update <code>VITE_MAPBOX_ACCESS_TOKEN</code> in <code>.env</code> for better accuracy.</p>
                    </div>
                </div>
            )}

            <div className="relative">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search address (e.g., Indirapuram, Noida)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                            className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-sm transition-all shadow-sm"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                    </div>
                    <button
                        type="button"
                        onClick={() => executeSearch()}
                        disabled={isSearching}
                        className="px-6 py-3 bg-[#D4AF37] text-white rounded-2xl text-sm font-bold hover:bg-[#C5A059] disabled:opacity-50 transition shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                    </button>
                </div>

                {/* Suggestions List */}
                {suggestions.length > 0 && (
                    <div className="absolute z-[1001] w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                        {suggestions.map((feature) => (
                            <button
                                key={feature.id}
                                type="button"
                                onClick={() => selectLocation(feature)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 transition flex items-start gap-3"
                            >
                                <MapPin className="w-5 h-5 text-[#D4AF37] mt-0.5 shrink-0" />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900 text-sm">{feature.text}</span>
                                    <span className="text-xs text-gray-500 line-clamp-1">{feature.place_name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map Container */}
            <div className="h-72 rounded-2xl overflow-hidden border border-gray-200 z-0 relative shadow-sm">
                <MapContainer
                    center={mapConfig.center}
                    zoom={mapConfig.zoom}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    <MapEventsHandler onMapClick={handleMapClick} />
                    <MapController center={mapConfig.center} zoom={mapConfig.zoom} />

                    {position && (
                        <Marker
                            position={position}
                            draggable={true}
                            eventHandlers={eventHandlers}
                        />
                    )}
                </MapContainer>

                {/* Floating Map Hint */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                    <p className="text-[10px] font-medium text-gray-600">
                        Click map or drag pin to adjust location
                    </p>
                </div>
            </div>

            {/* Coordinates Display */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Latitude</label>
                    <input
                        type="number"
                        step="any"
                        name="lat"
                        value={form.lat || ''}
                        onChange={handleManualInput}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] transition-all"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Longitude</label>
                    <input
                        type="number"
                        step="any"
                        name="lng"
                        value={form.lng || ''}
                        onChange={handleManualInput}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] transition-all"
                    />
                </div>
            </div>
        </div>
    );
}
