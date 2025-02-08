import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { destinationService, propertyService } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { FiArrowLeft, FiMapPin } from 'react-icons/fi';

function DestinationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinationData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch destination details
        const destinationResponse = await destinationService.getDestination(id);
        if (!destinationResponse.success) {
          throw new Error(destinationResponse.message || 'Failed to fetch destination');
        }
        setDestination(destinationResponse.data);

        // Fetch properties for this destination
        const propertiesResponse = await propertyService.getAllProperties({ destination: id });
        if (!propertiesResponse.success) {
          throw new Error(propertiesResponse.message || 'Failed to fetch properties');
        }
        setProperties(propertiesResponse.data);

      } catch (err) {
        console.error('Error fetching destination data:', err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDestinationData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/destinations')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiArrowLeft className="inline mr-2" />
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-600">Destination not found</p>
        <button 
          onClick={() => navigate('/destinations')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Destinations
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/destinations')}
          className="flex items-center text-gray-600 hover:text-blue-600"
        >
          <FiArrowLeft className="mr-2" /> Back to Destinations
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] mb-8">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40">
          <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{destination.name}</h1>
            <div className="flex items-center">
              <FiMapPin className="mr-2" />
              <span className="text-xl">{properties.length} properties available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">About {destination.name}</h2>
          <p className="text-gray-600 leading-relaxed">{destination.description}</p>
        </div>

        {/* Properties Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Places to stay in {destination.name}</h2>
          {properties.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No properties available in this destination yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Additional Information Section */}
      {destination.additionalInfo && (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
            <div className="prose max-w-none text-gray-600">
              {destination.additionalInfo}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DestinationPage;