import { useNavigate } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';

function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow text-center">
      <div className="text-red-500 text-6xl mb-4">
        <FiXCircle />
      </div>
      <h2 className="text-2xl font-semibold mb-4">Payment Failed</h2>
      <p className="text-gray-600 mb-6">
        We couldn't process your payment. Please try again or contact support if the problem persists.
      </p>
      <div className="space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
        <button
          onClick={() => navigate('/stays')}
          className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
        >
          Back to Stays
        </button>
      </div>
    </div>
  );
}

export default PaymentFailurePage;