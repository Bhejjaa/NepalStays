import { useState } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { FiCalendar, FiUsers } from 'react-icons/fi';

export default function BookingForm({ property }) {
  const { updateBooking, nextStep } = useBooking();
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.checkIn || !formData.checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    // Calculate number of nights and total price
    const nights = Math.ceil(
      (new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = nights * property.price;

    updateBooking({
      ...formData,
      totalPrice,
      property,
      nights
    });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Check-in</label>
          <div className="mt-1 relative">
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={formData.checkIn}
              onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Check-out</label>
          <div className="mt-1 relative">
            <input
              type="date"
              min={formData.checkIn || new Date().toISOString().split('T')[0]}
              value={formData.checkOut}
              onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Guests</label>
        <select
          value={formData.guests}
          onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {[...Array(property.maxGuests)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} {i === 0 ? 'guest' : 'guests'}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Continue to Book
      </button>
    </form>
  );
}