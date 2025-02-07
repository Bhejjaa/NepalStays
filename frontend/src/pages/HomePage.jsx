import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCalendar, FiUsers } from 'react-icons/fi';
import { FaRegHeart, FaStar } from 'react-icons/fa';
import { destinationService, propertyService } from '../services/api';

function HomePage() {
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: ''
  });
  const [destinationsLoading, setDestinationsLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDestinationsLoading(true);
        setPropertiesLoading(true);
        
        const [destinationsRes, propertiesRes] = await Promise.all([
          destinationService.getPopularDestinations(),
          propertyService.getFeaturedProperties()
        ]);
        
        console.log('Popular Destinations:', destinationsRes); // Debug log
        console.log('Featured Properties:', propertiesRes); // Debug log
        
        if (destinationsRes.success) {
          setPopularDestinations(destinationsRes.data);
        }
        if (propertiesRes.success) {
          setFeaturedProperties(propertiesRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load some content');
      } finally {
        setDestinationsLoading(false);
        setPropertiesLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search params:', searchParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Perfect Stay in Nepal
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            From cozy mountain retreats to luxury resorts, find your ideal accommodation
          </p>


{/* Search Form */}
<form onSubmit={handleSearch} className="max-w-4xl mx-auto">
  <div className="flex flex-col space-y-4">
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Location */}
      <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-200">
        <div className="w-full px-4 py-3">
          <div className="text-xs text-gray-500 mb-1">Location</div>
          <div className="flex items-center">
            <FiSearch className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Where are you going?"
              className="w-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
              value={searchParams.location}
              onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Check-in */}
      <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-200">
        <div className="w-full px-4 py-3">
          <div className="text-xs text-gray-500 mb-1">Check-in</div>
          <div className="flex items-center">
            <FiCalendar className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="date"
              className="w-full text-sm text-gray-900 focus:outline-none"
              value={searchParams.checkIn}
              onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Check-out */}
      <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-200">
        <div className="w-full px-4 py-3">
          <div className="text-xs text-gray-500 mb-1">Check-out</div>
          <div className="flex items-center">
            <FiCalendar className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="date"
              className="w-full text-sm text-gray-900 focus:outline-none"
              value={searchParams.checkOut}
              onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Guests */}
      <div className="flex-1 flex items-center">
        <div className="w-full px-4 py-3">
          <div className="text-xs text-gray-500 mb-1">Guests</div>
          <div className="flex items-center">
            <FiUsers className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="number"
              min="1"
              placeholder="Add guests"
              className="w-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
              value={searchParams.guests}
              onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Search Button */}
    <div className="flex justify-start">
      <button
        type="submit"
        className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
      >
        Search Stays
      </button>
    </div>
  </div>
</form>        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Popular Destinations</h2>
            <Link 
              to="/destinations" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all destinations
            </Link>
          </div>

          {destinationsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse">
                  <div className="rounded-lg bg-gray-200 h-64 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : popularDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularDestinations.map((destination) => (
                <Link 
                  key={destination._id} 
                  to={`/destinations/${destination._id}`}
                  className="group relative rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">{destination.name}</h3>
                      <div className="flex items-center text-white/90">
                        <svg 
                          className="w-5 h-5 mr-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                          />
                        </svg>
                        <span className="text-sm">{destination.propertyCount}+ properties</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No popular destinations found</p>
            </div>
          )}
        </div>
      </section>
      {/* Featured Stays */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Stays</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {featuredProperties.map((property) => (
              <div key={property._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-full h-48 object-cover"
                  />
                  <button 
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200"
                    onClick={() => console.log('Add to wishlist:', property._id)}
                  >
                    <FaRegHeart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
                    <div className="flex items-center">
                      <FaStar className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">{property.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                  <p className="text-lg font-semibold text-gray-900">
                    Rs. {property.price.toLocaleString()}<span className="text-sm font-normal text-gray-600">/night</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose NepalStays
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Verified Properties</h3>
              <p className="text-gray-600">All our properties are personally verified for quality and comfort</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Best Price Guarantee</h3>
              <p className="text-gray-600">We offer competitive pricing with no hidden charges</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600">Our support team is always ready to help you</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;