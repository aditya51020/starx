import { useCompare } from '../context/CompareContext';
import { Link } from 'react-router-dom';
import { Check, X, ArrowLeft, Trash2 } from 'lucide-react';

export default function Compare() {
    const { compareList, removeFromCompare, clearCompare } = useCompare();

    if (compareList.length === 0) {
        return (
            <div className="min-h-screen pt-24 px-4 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Properties Selected</h2>
                    <p className="text-gray-600 mb-6">Select at least 2 properties to compare</p>
                    <Link to="/properties" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">
                        Browse Properties
                    </Link>
                </div>
            </div>
        );
    }

    const features = [
        { label: 'Price', key: 'price', format: (val) => `₹${val?.toLocaleString('en-IN')}` },
        { label: 'Location', key: 'region' },
        { label: 'Type', key: 'propertyType' },
        { label: 'BHK', key: 'bhk' },
        { label: 'Area', key: 'area', format: (val) => `${val} sqft` },
        { label: 'Furnishing', key: 'furnishing' },
        { label: 'Bathrooms', key: 'bathrooms' },
        { label: 'Status', key: 'transactionType' },
    ];

    const amenitiesList = ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Lift', 'WiFi', 'Power Backup'];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/properties" className="p-2 bg-white rounded-full shadow hover:shadow-md transition">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Property Comparison</h1>
                    </div>
                    <button
                        onClick={clearCompare}
                        className="flex items-center gap-2 text-red-600 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition"
                    >
                        <Trash2 className="w-4 h-4" /> Clear Comparison
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="p-6 text-left w-48 bg-gray-50/50 sticky left-0 z-10 font-bold text-gray-700">Features</th>
                                {compareList.map((property) => (
                                    <th key={property.id} className="p-6 min-w-[300px] text-left">
                                        <div className="relative group">
                                            <button
                                                onClick={() => removeFromCompare(property.id)}
                                                className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                title="Remove"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <Link to={`/property/${property.id}`} className="block">
                                                <img
                                                    src={property.images?.[0]}
                                                    alt={property.title}
                                                    className="w-full h-48 object-cover rounded-xl mb-4 hover:shadow-md transition"
                                                />
                                                <h3 className="font-bold text-xl text-gray-900 line-clamp-2 mb-2 hover:text-blue-600">{property.title}</h3>
                                                <p className="text-blue-600 text-lg font-bold">₹{property.price?.toLocaleString('en-IN')}</p>
                                            </Link>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature) => (
                                <tr key={feature.key} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition">
                                    <td className="p-6 font-semibold text-gray-600 bg-gray-50/30 sticky left-0 z-10">{feature.label}</td>
                                    {compareList.map((property) => (
                                        <td key={property.id} className="p-6 text-gray-900 font-medium">
                                            {feature.format ? feature.format(property[feature.key]) : (property[feature.key] || '-')}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {/* Amenities Comparison */}
                            <tr>
                                <td className="p-6 font-semibold text-gray-600 bg-gray-50/30 sticky left-0 z-10 align-top">Amenities</td>
                                {compareList.map((property) => (
                                    <td key={property.id} className="p-6 align-top">
                                        <div className="space-y-2">
                                            {amenitiesList.map(amenity => {
                                                const hasAmenity = property.amenities?.includes(amenity);
                                                return (
                                                    <div key={amenity} className="flex items-center gap-2">
                                                        {hasAmenity ? (
                                                            <Check className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <X className="w-4 h-4 text-gray-300" />
                                                        )}
                                                        <span className={`text-sm ${hasAmenity ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                                                            {amenity}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </td>
                                ))}
                            </tr>

                            <tr>
                                <td className="p-6 bg-gray-50/30 sticky left-0"></td>
                                {compareList.map((property) => (
                                    <td key={property.id} className="p-6">
                                        <Link to={`/property/${property.id}`} className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                                            View Details
                                        </Link>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
