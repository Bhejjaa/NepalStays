import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { destinationService } from '../../services/api';

function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    propertyCount: '',
    description: '',
    image: null,
    isPopular: false
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

 // In your fetchDestinations function:
const fetchDestinations = async () => {
  try {
    const response = await destinationService.getAllDestinations();
    if (response.success) {
      setDestinations(response.data);
    } else {
      toast.error('Failed to fetch destinations');
    }
  } catch (error) {
    if (error.response?.status === 403) {
      toast.error('You do not have permission to access this page. Please log in as an admin.');
    } else {
      toast.error(error.message || 'Error fetching destinations');
    }
  } finally {
    setLoading(false);
  }
};

// In your handleSubmit function:
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  
  try {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('propertyCount', formData.propertyCount.toString());
    formDataToSend.append('description', formData.description);
    formDataToSend.append('isPopular', formData.isPopular.toString());
    
    if (!(formData.image instanceof File)) {
      toast.error('Please select a valid image file');
      setSubmitting(false);
      return;
    }
    
    formDataToSend.append('image', formData.image);

    // Log FormData contents
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    let response;
    if (selectedDestination) {
      response = await destinationService.updateDestination(selectedDestination._id, formDataToSend);
    } else {
      response = await destinationService.createDestination(formDataToSend);
    }

    if (response.success) {
      toast.success(selectedDestination ? 'Destination updated successfully' : 'Destination created successfully');
      fetchDestinations();
      resetForm();
    }
  } catch (error) {
    console.error('Error details:', error.response?.data);
    toast.error(error.response?.data?.message || 'Error saving destination');
  } finally {
    setSubmitting(false);
  }
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      console.log('File selected:', file); // Debug log
    } else {
      toast.error('Please select an image file');
    }
  }
};


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        await destinationService.deleteDestination(id);
        toast.success('Destination deleted successfully');
        fetchDestinations();
      } catch (error) {
        toast.error(error.message || 'Error deleting destination');
      }
    }
  };

  const handleEdit = (destination) => {
    setSelectedDestination(destination);
    setFormData({
      name: destination.name,
      propertyCount: destination.propertyCount,
      description: destination.description || '',
      isPopular: destination.isPopular || false,
      image: null
    });
  };

  const resetForm = () => {
    setSelectedDestination(null);
    setFormData({
      name: '',
      propertyCount: '',
      description: '',
      image: null,
      isPopular: false
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Destinations</h1>
      
      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {selectedDestination ? 'Edit Destination' : 'Add New Destination'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Property Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Property Count</label>
              <input
                type="number"
                value={formData.propertyCount}
                onChange={(e) => setFormData({...formData, propertyCount: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Image Upload */}
            <div>
    <label className="block text-sm font-medium text-gray-700">
      Image
    </label>
    <input
      type="file"
      onChange={handleFileChange}
      accept="image/*"
      className="mt-1 block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100"
    />
  </div>

            {/* Is Popular */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Popular Destination</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      {/* Destinations List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-xl font-semibold">All Destinations</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {destinations.map((destination) => (
            <li key={destination._id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{destination.name}</h3>
                    <p className="text-sm text-gray-500">{destination.propertyCount}+ properties</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(destination)}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(destination._id)}
                    className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDestinationsPage;