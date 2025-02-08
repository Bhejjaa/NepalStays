import { useState, useEffect } from 'react';
import { FiSearch, FiCalendar, FiUsers } from 'react-icons/fi';
import { propertyService } from '../services/api';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';

function StaysPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    price: '',
    type: '',
    rooms: '',
    amenities: [],
    rating: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching properties...');
      const response = await propertyService.getAllProperties();
      console.log('Properties response:', response);
      
      if (response.success) {
        setProperties(response.data);
      } else {
        setError('Failed to fetch properties');
        console.error('Failed to fetch properties:', response);
      }
    } catch (error) {
      setError(error.message || 'An error occurred while fetching properties');
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search filters:', filters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            {/* Location */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-600">Location</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
            </div>

            {/* Check-in */}
            <div className="w-[160px]">
              <label className="block text-sm text-gray-600">Check-in</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={filters.checkIn}
                  onChange={(e) => setFilters({ ...filters, checkIn: e.target.value })}
                />
              </div>
            </div>

            {/* Check-out */}
            <div className="w-[160px]">
              <label className="block text-sm text-gray-600">Check-out</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={filters.checkOut}
                  onChange={(e) => setFilters({ ...filters, checkOut: e.target.value })}
                />
              </div>
            </div>

            {/* Guests */}
            <div className="w-[140px]">
              <label className="block text-sm text-gray-600">Guests</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FiUsers className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="1"
                  placeholder="Guests"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={filters.guests}
                  onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end gap-10">
              <button
                type="submit"
                className="h-[42px] px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
              <Link
                to="/stays/add"
                className="h-[42px] px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                Add Your Property
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              Filters
            </button>
            <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              Price
            </button>
            <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              Type of Place
            </button>
            <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              Rooms
            </button>
            <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              Amenities
            </button>
            <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              Property Rating
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-2">
          <button className="px-4 py-2 border rounded-md hover:bg-gray-50">Previous</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">1</button>
          <button className="px-4 py-2 border rounded-md hover:bg-gray-50">2</button>
          <button className="px-4 py-2 border rounded-md hover:bg-gray-50">3</button>
          <button className="px-4 py-2 border rounded-md hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
}

export default StaysPage;