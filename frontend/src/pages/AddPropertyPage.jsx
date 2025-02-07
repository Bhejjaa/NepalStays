import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { propertyService, destinationService } from '../services/api';

function AddPropertyPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    destination: '',
    location: '',
    price: '',
    images: [],
    amenities: [],
    beds: '',
    baths: '',
    maxGuests: '',
    type: 'Hotel',
  });

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please log in to add a property');
          navigate('/login');
          return;
        }

        const response = await destinationService.getAllDestinations();
        if (response.success) {
          setDestinations(response.data);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error('Failed to fetch destinations');
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSubmitting(false);
        toast.error('Please log in to add a property');
        navigate('/login');
        return;
      }
  
      if (!formData.images.length) {
        setSubmitting(false);
        toast.error('Please select at least one image');
        return;
      }
  
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('destination', formData.destination);
      formDataToSend.append('location', formData.location.trim());
      formDataToSend.append('price', Number(formData.price));
      formDataToSend.append('beds', Number(formData.beds));
      formDataToSend.append('baths', Number(formData.baths));
      formDataToSend.append('maxGuests', Number(formData.maxGuests));
      formDataToSend.append('type', formData.type);
      formDataToSend.append('amenities', JSON.stringify(formData.amenities));
  
      // Add images
      formData.images.forEach((image) => {
        formDataToSend.append('images', image);
      });
  
      // Debug log
      console.log('Submitting property with data:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }
  
      const response = await propertyService.createProperty(formDataToSend);
      
      if (response.success) {
        toast.success('Property added successfully');
        navigate('/stays');
      } else {
        throw new Error(response.message || 'Failed to add property');
      }
    } catch (error) {
      console.error('Error details:', error);
      toast.error(error.message || 'Error adding property');
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      destination: '',
      location: '',
      price: '',
      images: [],
      amenities: [],
      beds: '',
      baths: '',
      maxGuests: '',
      type: 'Hotel',
    });
  };

  const amenitiesList = [
    'WiFi', 'Air Conditioning', 'Kitchen', 'Parking',
    'Pool', 'TV', 'Washing Machine', 'Hot Water'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Your Property</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Property Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <select
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a destination</option>
                  {destinations.map(dest => (
                    <option key={dest._id} value={dest._id}>{dest.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Property Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="Hotel">Hotel</option>
                  <option value="Resort">Resort</option>
                  <option value="Homestay">Homestay</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location and Pricing */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Location and Pricing</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price per Night (Rs)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Property Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Beds</label>
                <input
                  type="number"
                  value={formData.beds}
                  onChange={(e) => setFormData({...formData, beds: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Baths</label>
                <input
                  type="number"
                  value={formData.baths}
                  onChange={(e) => setFormData({...formData, baths: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Max Guests</label>
                <input
                  type="number"
                  value={formData.maxGuests}
                  onChange={(e) => setFormData({...formData, maxGuests: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {amenitiesList.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Property Images</h2>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Adding Property...' : 'Add Property'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPropertyPage;