import { useBooking } from '../../contexts/BookingContext';
import { FiCalendar, FiUsers, FiArrowLeft } from 'react-icons/fi';

export default function BookingSummary() {
  const { bookingData, nextStep, prevStep } = useBooking();
  const { property, checkIn, checkOut, guests, totalPrice, nights } = bookingData;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Booking Summary</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h3 className="font-medium">{property.name}</h3>
            <p className="text-gray-600">{property.location}</p>
          </div>
          <img 
            src={property.images[0]} 
            alt={property.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiCalendar className="mr-2" />
            <span>Check-in</span>
          </div>
          <span>{new Date(checkIn).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiCalendar className="mr-2" />
            <span>Check-out</span>
          </div>
          <span>{new Date(checkOut).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiUsers className="mr-2" />
            <span>Guests</span>
          </div>
          <span>{guests}</span>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between mb-2">
            <span>Rs. {property.price} × {nights} nights</span>
            <span>Rs. {totalPrice}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>Rs. {totalPrice}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={prevStep}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <FiArrowLeft className="inline mr-2" />
          Back
        </button>
        <button
          onClick={nextStep}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}