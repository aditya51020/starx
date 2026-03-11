import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationMarker({ position, setPosition, setForm }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            setForm(prev => ({
                ...prev,
                lat: e.latlng.lat,
                lng: e.latlng.lng
            }));
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    // Update map center when position changes externally
    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

// Component to handle map view updates
function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 13);
        }
    }, [center, map]);
    return null;
}

export default function LocationPicker({ form, setForm }) {
    const [position, setPosition] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    // Initial load
    useEffect(() => {
        if (form.lat && form.lng) {
            setPosition({ lat: parseFloat(form.lat), lng: parseFloat(form.lng) });
        }
    }, []); // Run once on mount

    const defaultCenter = [28.6692, 77.4538]; // Vasundhara, Ghaziabad

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSearchResults([]);
        try {
            // Helper function for Nominatim search
            const fetchResults = async (query) => {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}&limit=5`);
                return await response.json();
            };

            let data = await fetchResults(searchQuery);

            // Fallback Search: If no results, try removing specific details (commas, line numbers)
            if (!data || data.length === 0) {
                const parts = searchQuery.split(',');
                if (parts.length > 2) {
                    const broaderQuery = parts
                        .filter(part => !part.toLowerCase().includes('line') && !part.toLowerCase().includes('makan'))
                        .join(',') || parts.slice(-2).join(',');

                    if (broaderQuery !== searchQuery) {
                        toast.loading("Specific address not found, trying broader area...", { id: 'search-fallback' });
                        data = await fetchResults(broaderQuery);
                    }
                }
            }

            if (data && data.length > 0) {
                setSearchResults(data);
                // Automatically select first one if only one result
                if (data.length === 1) {
                    selectLocation(data[0]);
                } else {
                    toast.success(`Found ${data.length} matches. Please select one.`, { id: 'search-fallback' });
                }
            } else {
                toast.error('Location not found. Please try a broader area or manual pinning.', { duration: 5000 });
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Search failed');
        } finally {
            setIsSearching(false);
        }
    };

    const selectLocation = (result) => {
        const { lat, lon, display_name } = result;
        const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setPosition(newPos);
        setForm(prev => ({
            ...prev,
            lat: parseFloat(lat),
            lng: parseFloat(lon)
        }));
        setSearchResults([]);
        setSearchQuery(display_name.split(',')[0]);
        toast.success(`Selected: ${display_name.split(',')[0]}`);
    };

    const handleManualInput = (e) => {
        const { name, value } = e.target;
        const newForm = { ...form, [name]: value };
        setForm(newForm);

        if (newForm.lat && newForm.lng) {
            const lat = parseFloat(newForm.lat);
            const lng = parseFloat(newForm.lng);
            if (!isNaN(lat) && !isNaN(lng)) {
                setPosition({ lat, lng });
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                    Pin Location on Map
                </label>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search location (e.g., Indirapuram, Noida)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] text-sm"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                    <button
                        type="button"
                        disabled={isSearching}
                        onClick={handleSearch}
                        className="px-6 py-2 bg-[#D4AF37] text-white rounded-xl text-sm font-bold hover:bg-[#C5A059] disabled:opacity-50 transition shadow-sm hover:shadow-md"
                    >
                        {isSearching ? '...' : 'Search'}
                    </button>
                </div>

                {/* Suggestions List */}
                {searchResults.length > 0 && (
                    <div className="absolute z-[1001] w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                        {searchResults.map((result, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => selectLocation(result)}
                                className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0 transition flex flex-col gap-0.5"
                            >
                                <span className="font-semibold text-gray-900">{result.display_name.split(',')[0]}</span>
                                <span className="text-xs text-gray-500 truncate">{result.display_name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="h-64 rounded-xl overflow-hidden border border-gray-300 z-0 relative shadow-inner">
                <MapContainer
                    center={position || defaultCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    <LocationMarker position={position} setPosition={setPosition} setForm={setForm} />
                </MapContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                    <input
                        type="number"
                        step="any"
                        name="lat"
                        placeholder="e.g. 28.6139"
                        value={form.lat || ''}
                        onChange={handleManualInput}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                    <input
                        type="number"
                        step="any"
                        name="lng"
                        placeholder="e.g. 77.2090"
                        value={form.lng || ''}
                        onChange={handleManualInput}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]"
                    />
                </div>
            </div>
        </div>
    );
}
