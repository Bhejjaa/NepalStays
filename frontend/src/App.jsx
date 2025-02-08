import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import { Suspense, useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { userService } from './services/api';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AuthCallback from './components/auth/AuthCallback';

// Main Pages
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationPage from './pages/DestinationPage';
import StaysPage from './pages/StaysPage';
import PropertyPage from './pages/PropertyPage';
import AddPropertyPage from './pages/AddPropertyPage';
import ExperiencesPage from './pages/ExperiencesPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminDestinationsPage from './pages/DestinationsPage';


// Layout Components
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Payment Pages
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';

import AboutPage from './pages/AboutPage';


// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await userService.getProfile();
          if (!response.success) {
            localStorage.removeItem('token');
            throw new Error('Failed to fetch profile');
          }
        }
      } catch (error) {
        console.error('Initialization error:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
  
    initializeApp();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <Navbar />
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* Destination Routes */}
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/destinations/:id" element={<DestinationPage />} />
                
{/* Property Routes */}
<Route path="/stays/add" element={
  <ProtectedRoute>
    <AddPropertyPage />
  </ProtectedRoute>
} />
<Route path="/stays/:id" element={<PropertyPage />} />
<Route path="/stays" element={<StaysPage />} />
                {/* Other Public Routes */}
                <Route path="/experiences" element={<ExperiencesPage />} />

                {/* Protected Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />

                {/* Payment Routes */}
                <Route path="/payment/:bookingId" element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                } />
                <Route path="/payment/success" element={<PaymentSuccessPage />} />
                <Route path="/payment/failure" element={<PaymentFailurePage />} />

                {/* Admin Routes */}
                <Route path="/admin/destinations" element={
                  <AdminRoute>
                    <AdminDestinationsPage />
                  </AdminRoute>
                } />

              </Routes>
            </main>
          </Suspense>
        </Router>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;