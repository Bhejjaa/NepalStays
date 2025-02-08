import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BookingModal({ property, isOpen, onClose }) {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First check availability
      const availabilityResponse = await fetch('/api/bookings/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          propertyId: property._id,
          ...bookingData
        })
      });
      const availabilityData = await availabilityResponse.json();

      if (!availabilityData.data.isAvailable) {
        setError('Property not available for selected dates');
        return;
      }

      // Calculate price
      const priceResponse = await fetch('/api/bookings/calculate-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          propertyId: property._id,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut
        })
      });
      const priceData = await priceResponse.json();

      // Create booking
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          property: property._id,
          ...bookingData,
          totalPrice: priceData.data.totalPrice
        })
      });

      const bookingResult = await bookingResponse.json();
      if (bookingResult.success) {
        // Proceed to payment
        navigate(`/payment/${bookingResult.data._id}`);
      }
    } catch (err) {
      setError('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Book Your Stay</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={bookingData.checkIn}
              onChange={(e) => setBookingData(prev => ({ ...prev, checkIn: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
            <input
              type="date"
              required
              min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
              value={bookingData.checkOut}
              onChange={(e) => setBookingData(prev => ({ ...prev, checkOut: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Guests</label>
            <select
              value={bookingData.guests}
              onChange={(e) => setBookingData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {[...Array(property.maxGuests)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !bookingData.checkIn || !bookingData.checkOut}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Continue to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;