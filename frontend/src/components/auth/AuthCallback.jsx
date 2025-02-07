import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/api';
import { toast } from 'react-toastify';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      authService.handleGoogleCallback(token)
        .then(() => {
          toast.success('Google login successful!');
          navigate('/');
        })
        .catch((error) => {
          toast.error('Login failed');
          navigate('/');
        });
    } else {
      navigate('/');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-xl">Loading...</div>
    </div>
  );
};

export default AuthCallback;