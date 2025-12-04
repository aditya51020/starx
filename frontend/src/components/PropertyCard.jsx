import { Link } from 'react-router-dom';

export default function PropertyCard({ property, view }) {
  const badgeColor = property.transactionType === 'Rent' ? 'bg-green-100 text-green-800' :
                     property.transactionType === 'Sell' ? 'bg-blue-100 text-blue-800' :
                     'bg-gray-100 text-gray-800';

  return (
    <Link to={`/property/${property._id}`} className={`block bg-white rounded-lg shadow hover:shadow-lg transition ${view === 'list' ? 'flex' : ''}`}>
      <img src={property.images[0]} alt={property.title} className={`object-cover ${view === 'grid' ? 'w-full h-48' : 'w-48 h-32'}`} />
      <div className="p-4 flex-1">
        <h3 className="font-medium text-lg">{property.title}</h3>
        <p className="text-indigo-600 font-bold">₹{property.price.toLocaleString()}</p>
        <p className="text-sm text-gray-600">{property.region} • {property.bhk} BHK • {property.area} sqft</p>
        <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${badgeColor}`}>
          {property.transactionType}
        </span>
      </div>
    </Link>
  );
}