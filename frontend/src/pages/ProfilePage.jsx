import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin } from 'react-icons/fi';
import { userService } from '../services/api';
import { toast } from 'react-toastify';
import defaultAvatar from '../assets/images/default-avatar.png';

function ProfilePage() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    location: '',
    profileImage: '',
    bookings: [],
    favorites: []
  });
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirm: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userService.getProfile();
      console.log('Profile response:', response); // Debug log
      if (response.success) {
        setUserData(response.data);
        setLoading(false);
      } else {
        toast.error(response.message || 'Failed to fetch profile');
        setLoading(false);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Failed to fetch profile');
      setLoading(false);
    }
  };


  const handlePasswordChange = (e) => {
    setPasswords(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      const response = await userService.updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });

      if (response.success) {
        toast.success('Password updated successfully');
        setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    }
  };

  const handleToggleFavorite = async (propertyId) => {
    try {
      const response = await userService.toggleFavorite({ propertyId });
      if (response.success) {
        await fetchUserProfile();
        toast.success('Wishlist updated successfully');
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center space-x-4">
        <img
  src={userData?.profileImage || defaultAvatar}
  alt="Profile"
  className="w-20 h-20 rounded-full object-cover"
/>
<div>
  <h1 className="text-2xl font-bold">{userData.name}</h1>
  <p className="text-gray-600">{userData.email}</p>
  {userData?.location && (
    <div className="flex items-center text-gray-500 mt-1">
      <FiMapPin className="w-4 h-4 mr-1" />
      <span>{userData.location}</span>
    </div>
  )}
</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Booking History</h2>
            <div className="space-y-4">
            {userData?.bookings?.length > 0 ? (
  userData.bookings.map((booking) => (
                  <div key={booking._id} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <Link 
                        to={`/properties/${booking.property._id}`}
                        className="font-semibold hover:text-blue-600"
                      >
                        {booking.property.name}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.checkIn).toLocaleDateString()} - 
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      new Date(booking.checkOut) < new Date() 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {new Date(booking.checkOut) < new Date() ? 'Completed' : 'Upcoming'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No bookings yet</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Favorites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userData?.favorites?.length > 0 ? (
  userData.favorites.map((property) => (
                  <div key={property._id} className="relative group">
                    <Link to={`/properties/${property._id}`}>
                      <img
                        src={property.images[0]}
                        alt={property.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="p-2">
                        <h3 className="font-semibold">{property.name}</h3>
                        <p className="text-sm text-gray-600">{property.location}</p>
                        <p className="text-sm font-semibold">Rs. {property.price}/night</p>
                      </div>
                    </Link>
                    <button 
                      onClick={() => handleToggleFavorite(property._id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
                    >
                      <FiHeart className="w-5 h-5 text-red-500 fill-current" />
                    </button>
                  </div>
  ))
) : (
  <p className="text-gray-500 col-span-2">No favorites yet</p>
)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Account Settings</h2>
          <form onSubmit={handleUpdatePassword}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;