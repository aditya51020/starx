import mongoose from 'mongoose';

const amenityEnum = [
  'Parking',
  'Lift',
  'Gym',
  'Security',
  'Power Backup',
  'Swimming Pool',
  'Garden',
  'Club House',
  'WiFi',
  'AC',
  'Modular Kitchen',
  'Washing Machine'
];

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  metaDescription: String,
  keywords: [String],
  region: { type: String, enum: ['Vasundhara', 'Indirapuram', 'Sector 63'], required: true },
  propertyType: { type: String, required: true },
  transactionType: { type: String, enum: ['Rent', 'Sell', 'Sold'], required: true },
  price: { type: Number, required: true },
  area: { type: Number, required: true },
  bhk: { type: Number, required: true },
  floor: Number,
  totalFloors: Number,
  furnishing: { type: String, enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'], required: true },
  amenities: [{ type: String, enum: amenityEnum }],
  address: { type: String, required: true },
  lat: Number,
  lng: Number,
  images: [{ type: String, required: true }],
  contactName: String,
  contactPhone: String,
  contactEmail: String,
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);