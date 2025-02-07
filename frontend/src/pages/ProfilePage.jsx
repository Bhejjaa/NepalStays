import { useState } from 'react';
import { FiHeart, FiMapPin } from 'react-icons/fi';
import defaultAvatar from '../assets/images/default-avatar.png';

import mountainresortImage from '../assets/images/properties/img.png';
import lakesideImage from '../assets/images/properties/3.png';

function ProfilePage() {
  const [user] = useState({
    name: 'Pujendra Thapa',
    email: 'thapapujendra1@gmail.com',
    location: 'Kathmandu, Nepal',
    avatar: defaultAvatar
  });

  const [bookings] = useState([
    {
      id: 1,
      propertyName: 'Himalayan Resort & Spa',
      date: 'March 15-20, 2023',
      status: 'completed'
    },
    {
      id: 2,
      propertyName: 'Pokhara Lake View Resort',
      date: 'April 5-8, 2023',
      status: 'upcoming'
    }
  ]);

  const [favorites] = useState([
    {
      id: 1,
      name: 'Mountain View Resort',
      location: 'Nagarkot, Nepal',
      image: mountainresortImage
    },
    {
      id: 2,
      name: 'Lakeside Villa',
      location: 'Pokhara, Nepal',
      image: lakesideImage
    }
  ]);

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    // Password update logic would go here
    console.log('Password update requested');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center text-gray-500 mt-1">
              <FiMapPin className="w-4 h-4 mr-1" />
              <span>{user.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Booking History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Booking History</h2>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="font-semibold">{booking.propertyName}</h3>
                    <p className="text-sm text-gray-600">{booking.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    booking.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Favorites */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Favorites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="relative group">
                  <img
                    src={favorite.image}
                    alt={favorite.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow">
                    <FiHeart className="w-5 h-5 text-red-500 fill-current" />
                  </button>
                  <div className="p-2">
                    <h3 className="font-semibold">{favorite.name}</h3>
                    <p className="text-sm text-gray-600">{favorite.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Account Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Account Settings</h2>
          <form onSubmit={handleUpdatePassword}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  name="new"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
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