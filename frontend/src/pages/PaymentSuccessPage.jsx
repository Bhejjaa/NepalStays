import { useNavigate } from 'react-router-dom';

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow text-center">
      <div className="text-green-500 text-6xl mb-4">✓</div>
      <h2 className="text-2xl font-semibold mb-4">Payment Successful!</h2>
      <p className="text-gray-600 mb-6">Your booking has been confirmed.</p>
      <button
        onClick={() => navigate('/profile')}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        View My Bookings
      </button>
    </div>
  );
}

export default PaymentSuccessPage;