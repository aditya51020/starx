import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const schema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  region: z.enum(['Vasundhara', 'Indirapuram', 'Sector 63']),
  propertyType: z.string(),
  transactionType: z.enum(['Rent', 'Sell', 'Sold']),
  price: z.coerce.number().positive(),
  area: z.coerce.number().positive(),
  bhk: z.coerce.number().int().min(1),
  floor: z.coerce.number().optional(),
  totalFloors: z.coerce.number().optional(),
  furnishing: z.enum(['Furnished', 'Semi-Furnished', 'Unfurnished']),
  amenities: z.array(z.string()).default([]),
  address: z.string(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  contactName: z.string(),
  contactPhone: z.string(),
  contactEmail: z.string().email(),
  featured: z.boolean().default(false),
  status: z.enum(['Active', 'Inactive']).default('Active')
});

export default function AddEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [images, setImages] = useState([]);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/admin/properties/${id}`).then(res => {
        const p = res.data;
        Object.keys(p).forEach(k => setValue(k, p[k]));
        setImages(p.images);
      });
    }
  }, [id, setValue, isEdit]);

  const onDrop = async e => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const form = new FormData();
    files.forEach(f => form.append('images', f));
    const res = await axios.post('/api/admin/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    setImages(i => [...i, ...res.data.urls]);
  };

  const onSubmit = async data => {
    data.images = images;
    if (isEdit) {
      await axios.put(`/api/admin/properties/${id}`, data);
    } else {
      await axios.post('/api/admin/properties', data);
    }
    toast.success('Saved');
    navigate('/admin/listings');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic fields – omitted for brevity, use register(...) */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        className="border-2 border-dashed rounded p-8 text-center">
        <p>Drag & drop images (max 10)</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {images.map((url, i) => <img key={i} src={url} alt="" className="w-24 h-24 object-cover rounded" />)}
        </div>
      </div>
      <button type="submit" className="btn-primary">Save Property</button>
    </form>
  );
}