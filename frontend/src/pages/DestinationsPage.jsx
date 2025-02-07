import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { destinationService } from '../services/api';
import destinationsHeroImage from '../assets/images/destinations-page.png';

function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await destinationService.getAllDestinations();
        console.log('API Response:', response); // Debug log
        if (response.success && response.data) {
          setDestinations(response.data);
        } else {
          setError('Failed to fetch destinations');
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px]">
        <img
          src={destinationsHeroImage}
          alt="Nepal Destinations"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <h1 className="text-5xl font-bold text-white">
              Discover Nepal's Finest Destinations
            </h1>
          </div>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <Link 
                key={destination._id} 
                to={`/destinations/${destination._id}`}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-[16/9]">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.error(`Failed to load image for ${destination.name}`);
                      e.target.src = 'fallback-image-url';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-sm font-medium text-white/90">
                      {destination.propertyCount}+ properties
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Content Section (if needed) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Nepal's Beauty
            </h2>
            <p className="text-lg text-gray-600">
              From the majestic Himalayas to the cultural heritage sites, 
              discover the perfect destination for your next adventure.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DestinationsPage;