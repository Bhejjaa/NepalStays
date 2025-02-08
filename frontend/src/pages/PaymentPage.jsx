import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paymentService } from '../services/api';

function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    initiatePayment();
  }, [bookingId]);

  const initiatePayment = async () => {
    try {
      const response = await paymentService.initiatePayment(bookingId);
      if (!response.success) {
        throw new Error(response.message);
      }
      setPaymentData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEsewaPayment = (e) => {
    e.preventDefault();
    if (!paymentData) return;
  
    // Create form
    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', paymentData.paymentUrl);
    form.setAttribute('target', '_blank'); // Open in new tab
  
    // Log the parameters for debugging
    console.log('eSewa Parameters:', paymentData.esewaParams);
  
    // Add all eSewa parameters
    for (const [key, value] of Object.entries(paymentData.esewaParams)) {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', key);
      input.setAttribute('value', value.toString());
      form.appendChild(input);
    }
  
    // Add form to body, submit it, and remove it
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };
  
  if (loading) return <div className="flex justify-center items-center h-96">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
  </div>;

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Complete Your Payment</h2>
      
      {paymentData?.bookingDetails && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Booking Details</h3>
          <p>Property: {paymentData.bookingDetails.propertyName}</p>
          <p>Check-in: {new Date(paymentData.bookingDetails.checkIn).toLocaleDateString()}</p>
          <p>Check-out: {new Date(paymentData.bookingDetails.checkOut).toLocaleDateString()}</p>
          <p>Guests: {paymentData.bookingDetails.guests}</p>
        </div>
      )}

      <div className="mb-6">
        <p className="text-gray-600 mb-2">Total Amount:</p>
        <p className="text-3xl font-bold">Rs. {paymentData?.esewaParams.tAmt}</p>
      </div>

      <form onSubmit={handleEsewaPayment} className="w-full">
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Pay with eSewa
        </button>
      </form>
    </div>
  );
}

export default PaymentPage;