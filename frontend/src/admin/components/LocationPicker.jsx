import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function LocationPicker({ form, setForm }) {
    const [position, setPosition] = useState(null);

    useEffect(() => {
        if (form.lat && form.lng) {
            setPosition({ lat: form.lat, lng: form.lng });
        }
    }, [form.lat, form.lng]);

    const defaultCenter = [28.6692, 77.4538]; // Vasundhara, Ghaziabad

    return (
        <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
                Pin Location on Map (Click to select)
            </label>
            <div className="h-64 rounded-xl overflow-hidden border border-gray-300 z-0">
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
                        step="0.000001"
                        value={form.lat || ''}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                    <input
                        type="number"
                        step="0.000001"
                        value={form.lng || ''}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                    />
                </div>
            </div>
        </div>
    );
}
