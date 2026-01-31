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

    // Initial load
    useEffect(() => {
        if (form.lat && form.lng) {
            setPosition({ lat: parseFloat(form.lat), lng: parseFloat(form.lng) });
        }
    }, []); // Run once on mount

    const defaultCenter = [28.6692, 77.4538]; // Vasundhara, Ghaziabad

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };

                setPosition(newPos);
                setForm(prev => ({
                    ...prev,
                    lat: parseFloat(lat),
                    lng: parseFloat(lon)
                }));
                toast.success(`Found: ${data[0].display_name.split(',')[0]}`);
            } else {
                toast.error('Location not found');
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Search failed');
        } finally {
            setIsSearching(false);
        }
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
            <div className="relative">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search location (e.g., Indirapuram, Noida)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] text-sm"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="px-4 py-2 bg-[#D4AF37] text-white rounded-xl text-sm font-medium hover:bg-[#C5A059] disabled:opacity-50"
                    >
                        {isSearching ? '...' : 'Search'}
                    </button>
                </form>
            </div>

            <div className="h-64 rounded-xl overflow-hidden border border-gray-300 z-0 relative">
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
