import { FileText } from 'lucide-react';
import LocationPicker from './LocationPicker';

export default function AdditionalInfo({ form, setForm, errors, availableAmenities, toggleAmenity }) {
    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#FFFDF0] rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Additional Info</h2>
                    <p className="text-sm text-gray-600">More property details</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                    placeholder="Describe the property, amenities, location benefits..."
                    rows="6"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#D4AF37] resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Floor</label>
                    <input
                        type="text"
                        placeholder="3rd"
                        value={form.floor}
                        onChange={e => setForm({ ...form, floor: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Floors</label>
                    <input
                        type="text"
                        placeholder="G+10"
                        value={form.totalFloors}
                        onChange={e => setForm({ ...form, totalFloors: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Property Age</label>
                    <input
                        type="text"
                        placeholder="2-5 years"
                        value={form.propertyAge}
                        onChange={e => setForm({ ...form, propertyAge: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Facing</label>
                    <select
                        value={form.facing}
                        onChange={e => setForm({ ...form, facing: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    >
                        <option value="">Select Facing</option>
                        <option>North</option>
                        <option>South</option>
                        <option>East</option>
                        <option>West</option>
                        <option>North-East</option>
                        <option>North-West</option>
                        <option>South-East</option>
                        <option>South-West</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name</label>
                <input
                    type="text"
                    placeholder="Agent/Owner Name"
                    value={form.contactName}
                    onChange={e => setForm({ ...form, contactName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone *</label>
                <input
                    type="tel"
                    placeholder="9876543210"
                    value={form.contactPhone}
                    onChange={e => setForm({ ...form, contactPhone: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl ${errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Amenities</label>
                <div className="grid grid-cols-2 gap-3">
                    {availableAmenities.map(amenity => (
                        <button
                            key={amenity}
                            type="button"
                            onClick={() => toggleAmenity(amenity)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition ${form.amenities.includes(amenity)
                                ? 'bg-[#D4AF37] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {amenity}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Nearby Places (Distance in km)</label>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Metro Station</label>
                        <input
                            type="number"
                            step="0.1"
                            placeholder="e.g. 0.5"
                            value={form.nearbyPlaces?.metro || ''}
                            onChange={e => setForm({ ...form, nearbyPlaces: { ...form.nearbyPlaces, metro: e.target.value } })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Hospital</label>
                        <input
                            type="number"
                            step="0.1"
                            placeholder="e.g. 1.2"
                            value={form.nearbyPlaces?.hospital || ''}
                            onChange={e => setForm({ ...form, nearbyPlaces: { ...form.nearbyPlaces, hospital: e.target.value } })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">School</label>
                        <input
                            type="number"
                            step="0.1"
                            placeholder="e.g. 0.8"
                            value={form.nearbyPlaces?.school || ''}
                            onChange={e => setForm({ ...form, nearbyPlaces: { ...form.nearbyPlaces, school: e.target.value } })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Market / Mall</label>
                        <input
                            type="number"
                            step="0.1"
                            placeholder="e.g. 2.0"
                            value={form.nearbyPlaces?.market || ''}
                            onChange={e => setForm({ ...form, nearbyPlaces: { ...form.nearbyPlaces, market: e.target.value } })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <LocationPicker form={form} setForm={setForm} />
            </div>
        </div>
    );
}
