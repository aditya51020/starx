import { Home, Star } from 'lucide-react';

export default function BasicDetails({ form, setForm, errors }) {
    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#FFFDF0] rounded-xl flex items-center justify-center">
                    <Home className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Basic Details</h2>
                    <p className="text-sm text-gray-600">Property information</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Title *
                </label>
                <input
                    type="text"
                    placeholder="e.g., Luxury 3 BHK in Vasundhara"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#D4AF37] transition ${errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address *
                </label>
                <input
                    type="text"
                    placeholder="Full address of the property"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#D4AF37] transition ${errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                </label>
                <select
                    value={form.region}
                    onChange={e => setForm({ ...form, region: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#D4AF37] transition ${errors.region ? 'border-red-500' : 'border-gray-300'
                        }`}
                >
                    <option value="">Select Region</option>
                    <option>Vasundhara</option>
                    <option>Indirapuram</option>
                    <option>Sector 63</option>
                </select>
                {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Type *
                </label>
                <select
                    value={form.propertyType}
                    onChange={e => setForm({ ...form, propertyType: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#D4AF37] transition ${errors.propertyType ? 'border-red-500' : 'border-gray-300'
                        }`}
                >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Independent House">Independent House</option>
                </select>
                {errors.propertyType && <p className="text-red-500 text-xs mt-1">{errors.propertyType}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">BHK *</label>
                    <input
                        type="number"
                        placeholder="3"
                        min="1"
                        max="10"
                        value={form.bhk}
                        onChange={e => setForm({ ...form, bhk: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-xl ${errors.bhk ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
                    <input
                        type="number"
                        placeholder="2"
                        min="1"
                        max="10"
                        value={form.bathrooms}
                        onChange={e => setForm({ ...form, bathrooms: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Area (sq.ft) *</label>
                <input
                    type="number"
                    placeholder="1500"
                    min="1"
                    value={form.area}
                    onChange={e => setForm({ ...form, area: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl ${errors.area ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                <input
                    type="number"
                    placeholder="5000000"
                    min="1"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl ${errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction Type</label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setForm({ ...form, transactionType: 'Sell' })}
                        className={`py-3 rounded-xl font-semibold transition ${form.transactionType === 'Sell'
                            ? 'bg-[#D4AF37] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        For Sale
                    </button>
                    <button
                        type="button"
                        onClick={() => setForm({ ...form, transactionType: 'Rent' })}
                        className={`py-3 rounded-xl font-semibold transition ${form.transactionType === 'Rent'
                            ? 'bg-[#D4AF37] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        For Rent
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Furnishing Status</label>
                <select
                    value={form.furnishing}
                    onChange={e => setForm({ ...form, furnishing: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                >
                    <option value="Furnished">Fully Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                </select>
            </div>

            <div className="pt-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={form.featured}
                            onChange={e => setForm({ ...form, featured: e.target.checked })}
                            className="w-6 h-6 text-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#D4AF37]"
                        />
                    </div>
                    <div>
                        <span className="text-sm font-bold text-gray-900 group-hover:text-[#D4AF37] transition flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            Featured Property
                        </span>
                        <span className="text-xs text-gray-600">Show on homepage</span>
                    </div>
                </label>
            </div>
        </div>
    );
}
