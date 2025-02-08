import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 60000, // 60 second default timeout
  headers: {
    'Accept': 'application/json',
  },
  maxContentLength: Infinity,
  maxBodyLength: Infinity
});



// Add request interceptor to automatically add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging
    console.log('Request being sent:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data instanceof FormData ? 'FormData' : config.data
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.user.token);
    }
    return response.data;
  },

  register: async ({ firstName, lastName, email, password }) => {
    const response = await api.post('/api/auth/register', {
      firstName,
      lastName,
      email,
      password
    });
    if (response.data.success) {
      localStorage.setItem('token', response.data.user.token);
    }
    return response.data;
  },

  handleGoogleCallback: async (token) => {
    localStorage.setItem('token', token);
    return { success: true };
  }
};

export const userService = {
  getProfile: async () => {
    try {
      const response = await api.get('/api/users/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
  
  updatePassword: async (data) => {
    try {
      const response = await api.put('/api/users/password', data);
      return response.data;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  },

  toggleFavorite: async (data) => {
    try {
      const response = await api.post('/api/users/favorites', data);
      return response.data;
    } catch (error) {
      console.error('Toggle favorite error:', error);
      throw error;
    }
  }
};

export const propertyService = {
  getAllProperties: async (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    const response = await api.get(`/api/properties${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },
  
  getFeaturedProperties: async () => {
    const response = await api.get('/api/properties/featured');
    return response.data;
  },

  getProperty: async (id) => {
    try {
      console.log('Fetching property:', id); // Debug log
      const response = await api.get(`/api/properties/${id}`);
      console.log('Property response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  },

  createProperty: async (formData) => {
    const response = await api.post('/api/properties', formData);
    return response.data;
  },

  updateProperty: async (id, formData) => {
    const response = await api.put(`/api/properties/${id}`, formData);
    return response.data;
  },

  deleteProperty: async (id) => {
    const response = await api.delete(`/api/properties/${id}`);
    return response.data;
  },
  getFeaturedProperties: async () => {
    try {
      const response = await api.get('/api/properties/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      throw error;
    }
  }
};

export const destinationService = {
  getAllDestinations: async () => {
    const response = await api.get('/api/destinations');
    return response.data;
  },

  getPopularDestinations: async () => {
    const response = await api.get('/api/destinations/popular');
    return response.data;
  },

  createDestination: async (formData) => {
    const response = await api.post('/api/destinations', formData);
    return response.data;
  },

  updateDestination: async (id, formData) => {
    const response = await api.put(`/api/destinations/${id}`, formData);
    return response.data;
  },

  deleteDestination: async (id) => {
    const response = await api.delete(`/api/destinations/${id}`);
    return response.data;
  },
  getDestination: async (id) => {
    const response = await api.get(`/api/destinations/${id}`);
    return response.data;
  },
  // Add this new method
  getPropertiesByDestination: async (destinationId) => {
    const response = await api.get(`/api/properties?destination=${destinationId}`);
    return response.data;
  }
};

export const paymentService = {
  initiatePayment: async (bookingId) => {
    const response = await api.post('/api/payments/initiate', { bookingId });
    return response.data;
  },

  getPaymentStatus: async (paymentId) => {
    const response = await api.get(`/api/payments/status/${paymentId}`);
    return response.data;
  }
};

export default api;