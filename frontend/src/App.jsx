import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import { Suspense, useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AuthCallback from './components/auth/AuthCallback';

// Main Pages
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import StaysPage from './pages/StaysPage';
import AddPropertyPage from './pages/AddPropertyPage';
import ExperiencesPage from './pages/ExperiencesPage';
import ProfilePage from './pages/ProfilePage';
import PropertyPage from './pages/PropertyPage';  

// Admin Pages
import AdminDestinationsPage from './pages/admin/DestinationsPage';

// Layout Components
import Navbar from './components/layout/Navbar';

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if environment variables are loaded
    console.log('Environment Variables:', {
      apiUrl: import.meta.env.VITE_API_URL,
      googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
    });
    setIsLoading(false);
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
            <main className="container mx-auto px-4 py-8">
              <Routes>
              <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignUpPage />} />
  <Route path="/auth/callback" element={<AuthCallback />} />
  <Route path="/destinations" element={<DestinationsPage />} />
  <Route path="/admin/destinations" element={<AdminDestinationsPage />} />
  <Route path="/stays" element={<StaysPage />} />
  <Route path="/stays/add" element={<AddPropertyPage />} />
  <Route path="/properties/:id" element={<PropertyPage />} />
  <Route path="/experiences" element={<ExperiencesPage />} />
  <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </main>
          </Suspense>
        </Router>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;