import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService, userService } from '../services/api';
import { toast } from 'react-toastify';
import BookingModal from '../components/booking/BookingModal';

import { 
  FiHeart, 
  FiUser, 
  FiHome, 
  FiDroplet, 
  FiUsers, 
  FiCheck,
  FiArrowLeft 
} from 'react-icons/fi';

function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to save properties');
        navigate('/login');
        return;
      }

      const response = await userService.toggleFavorite({ propertyId: id });
      if (response.success) {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to save properties');
        navigate('/login');
      } else {
        toast.error('Failed to update favorites');
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('Property ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const propertyResponse = await propertyService.getProperty(id);
        if (!propertyResponse.success) {
          throw new Error(propertyResponse.message || 'Failed to load property');
        }
        setProperty(propertyResponse.data);

        // Check if property is in user's wishlist
        const userResponse = await userService.getProfile();
        if (userResponse.success && userResponse.data) {
          const favorites = userResponse.data.favorites || [];
          setIsFavorite(favorites.some(fav => fav._id === id));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/stays')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiArrowLeft className="inline mr-2" />
            Back to Stays
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-600">Property not found</p>
        <button 
          onClick={() => navigate('/stays')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Stays
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate('/stays')}
        className="mb-6 flex items-center text-gray-600 hover:text-blue-600"
      >
        <FiArrowLeft className="mr-2" /> Back to Stays
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-gray-600">
            <span className="flex items-center">
              <FiHome className="mr-1" /> {property.type}
            </span>
            <span>•</span>
            <span>{property.location}</span>
          </div>
          <button 
            onClick={handleToggleFavorite}
            className={`flex items-center ${
              isFavorite ? 'text-red-500' : 'text-gray-500'
            } hover:text-red-600 transition-colors duration-200`}
          >
            <FiHeart 
              className={`mr-1 ${isFavorite ? 'fill-current' : ''}`} 
            /> 
            {isFavorite ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {property.images && property.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${property.name} view ${index + 1}`}
            className="w-full h-64 object-cover rounded-lg"
          />
        ))}
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">About this place</h2>
            <p className="text-gray-600 mb-6">{property.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <FiHome className="w-5 h-5" />
                <span>{property.beds} Beds</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiDroplet className="w-5 h-5" />
                <span>{property.baths} Baths</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiUsers className="w-5 h-5" />
                <span>Up to {property.maxGuests} guests</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Amenities</h3>
            <div className="grid grid-cols-2 gap-4">
              {property.amenities && property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <FiCheck className="text-blue-600" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className="md:col-span-1">
          <div className="sticky top-8 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-2xl font-bold">
                Rs. {property.price}
                <span className="text-sm font-normal text-gray-600">/night</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1">{property.rating || 'New'}</span>
              </div>
            </div>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal 
        property={property}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}

export default PropertyPage;