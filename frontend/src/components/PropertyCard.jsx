import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

function PropertyCard({ property }) {
  return (
    <Link 
      to={`/properties/${property._id}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button 
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white"
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation
            // Add wishlist functionality here
          }}
        >
          <FiHeart className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
            {property.name}
          </h3>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">★ {property.rating || 'New'}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2">{property.location}</p>
        <p className="text-lg font-semibold text-gray-900">
          Rs. {property.price}<span className="text-sm font-normal text-gray-500">/night</span>
        </p>
      </div>
    </Link>
  );
}

export default PropertyCard;