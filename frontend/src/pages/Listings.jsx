import { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';

export default function Listings() {
  const [properties, setProperties] = useState([]);
  const [view, setView] = useState('grid');
  const [filters, setFilters] = useState({});

  const applyFilters = () => {
    const query = new URLSearchParams(filters).toString();
    axios.get(`/api/properties?${query}`).then(res => setProperties(res.data));
  };

  useEffect(() => { applyFilters(); }, [filters]);

  return (
    <div className="container mx-auto py-8">
      {/* Filters UI – omitted for brevity, uses setFilters */}
      <div className="flex justify-end mb-4">
        <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')} className="btn-secondary">
          {view === 'grid' ? 'List' : 'Grid'} View
        </button>
      </div>

      <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-6'}>
        {properties.map(p => <PropertyCard key={p._id} property={p} view={view} />)}
      </div>
    </div>
  );
}