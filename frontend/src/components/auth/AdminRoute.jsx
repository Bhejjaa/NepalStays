import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { userService } from '../../services/api';
import { toast } from 'react-toastify';

function AdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await userService.getProfile();
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    toast.error('Access denied: Admin only');
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;