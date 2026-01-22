// src/pages/admin/AddProperty.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

import BasicDetails from './components/BasicDetails';
import AdditionalInfo from './components/AdditionalInfo';
import ImageUpload from './components/ImageUpload';

export default function AddProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    description: '',
    region: '',
    address: '',
    propertyType: 'Apartment',
    bhk: '',
    area: '',
    price: '',
    transactionType: 'Sell',
    images: [],
    contactPhone: '',
    contactName: '',
    furnishing: 'Semi-Furnished',
    bathrooms: '',
    floor: '',
    totalFloors: '',
    propertyAge: '',
    facing: '',
    amenities: [],
    featured: false,
    lat: '',
    lng: ''
  });

  const [imageInput, setImageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Predefined amenities
  const availableAmenities = [
    'Parking',
    'Gym',
    'Swimming Pool',
    'Security',
    'Lift',
    'Power Backup',
    'Garden',
    'Club House',
    'WiFi',
    'AC',
    'Modular Kitchen',
    'Washing Machine'
  ];

  // Load property for edit
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api.get(`/api/admin/properties/${id}`)
        .then(res => {
          const p = res.data?.data || res.data || {};
          setForm({
            title: p.title || '',
            description: p.description || '',
            region: p.region || '',
            address: p.address || '',
            propertyType: p.propertyType || 'Apartment',
            bhk: p.bhk || '',
            area: p.area || '',
            price: p.price || '',
            transactionType: p.transactionType || 'Sell',
            images: Array.isArray(p.images) ? p.images : [],
            contactPhone: p.contactPhone || '',
            contactName: p.contactName || '',
            furnishing: p.furnishing || 'Semi-Furnished',
            bathrooms: p.bathrooms || '',
            floor: p.floor || '',
            totalFloors: p.totalFloors || '',
            propertyAge: p.propertyAge || '',
            facing: p.facing || '',
            amenities: Array.isArray(p.amenities) ? p.amenities : [],
            featured: p.featured || false,
            lat: p.lat || '',
            lng: p.lng || ''
          });
        })
        .catch(err => {
          console.error('Failed to load property:', err);
          toast.error('Failed to load property details. Please try again.');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.title?.trim()) newErrors.title = 'Title is required';
    if (!form.description?.trim()) newErrors.description = 'Description is required';
    if (!form.region) newErrors.region = 'Region is required';
    if (!form.address?.trim()) newErrors.address = 'Address is required';
    if (!form.propertyType) newErrors.propertyType = 'Property Type is required';
    if (!form.bhk || form.bhk < 1) newErrors.bhk = 'Valid BHK is required';
    if (!form.area || form.area < 1) newErrors.area = 'Valid area is required';
    if (!form.price || form.price < 1) newErrors.price = 'Valid price is required';
    if (!form.contactPhone?.trim()) newErrors.contactPhone = 'Contact phone is required';
    if (form.images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return newErrors;
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      setLoading(true);
      const res = await api.post('/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.urls) {
        setForm(prev => ({ ...prev, images: [...prev.images, ...res.data.urls] }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setForm({ ...form, images: [...form.images, imageInput.trim()] });
      setImageInput('');
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images: newImages });
  };

  const toggleAmenity = (amenity) => {
    const newAmenities = form.amenities.includes(amenity)
      ? form.amenities.filter(a => a !== amenity)
      : [...form.amenities, amenity];
    setForm({ ...form, amenities: newAmenities });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      toast.error('Missing Fields: Please fill in all required fields.');

      // Smooth scroll to the first error
      setTimeout(() => {
        const firstError = document.querySelector('.border-red-500');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }, 100);

      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...form,
        bhk: parseInt(form.bhk),
        area: parseInt(form.area),
        price: parseInt(form.price),
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : form.bhk,
        lat: form.lat ? parseFloat(form.lat) : undefined,
        lng: form.lng ? parseFloat(form.lng) : undefined
      };

      if (isEdit) {
        await api.put(`/api/admin/properties/${id}`, payload);
        toast.success('Property Updated Successfully!');
      } else {
        await api.post('/api/admin/properties', payload);
        toast.success('Property Added Successfully!');
      }
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Submit error:', err);
      toast.error(err.response?.data?.message || 'Failed to save property. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-[#D4AF37] mx-auto mb-4" />
          <p className="text-2xl font-semibold text-gray-700">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-[#D4AF37] hover:bg-white rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </button>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {isEdit ? '✏️ Edit Property' : '➕ Add New Property'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Update property details below' : 'Fill in the details to list a new property'}
            </p>
          </div>
          <div className="w-32"></div> {/* Spacer for alignment */}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Form Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">

            {/* Section 1: Basic Details */}
            <BasicDetails form={form} setForm={setForm} errors={errors} />

            {/* Section 2: Additional Details */}
            <AdditionalInfo
              form={form}
              setForm={setForm}
              errors={errors}
              availableAmenities={availableAmenities}
              toggleAmenity={toggleAmenity}
            />

            {/* Section 3: Images */}
            <ImageUpload
              form={form}
              errors={errors}
              imageInput={imageInput}
              setImageInput={setImageInput}
              handleFileUpload={handleFileUpload}
              handleAddImage={handleAddImage}
              handleRemoveImage={handleRemoveImage}
            />
          </div>

          {/* Submit Button */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:border-[#D4AF37] hover:text-[#D4AF37] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#D4AF37] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#C5A059] shadow-lg hover:shadow-[#D4AF37]/30 transition shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {isEdit ? 'Updating Property...' : 'Adding Property...'}
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    {isEdit ? 'Update Property' : 'Add Property'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}