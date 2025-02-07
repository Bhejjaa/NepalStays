import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
// At the top of the file
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

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
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

  export const destinationService = {
    getAllDestinations: async () => {
      const response = await api.get('/api/destinations');
      return response.data;
    },
  
    createDestination: async (formData) => {
      try {
        // Log the FormData contents for debugging
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
    
        const response = await api.post('/api/destinations', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        return response.data;
      } catch (error) {
        console.error('API Error:', error.response?.data);
        throw error;
      }
    },

    updateDestination: async (id, formData) => {
      // Remove Content-Type from default headers for FormData
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      };
      const response = await api.put(`/api/destinations/${id}`, formData, config);
      return response.data;
    },
  
    deleteDestination: async (id) => {
      const response = await api.delete(`/api/destinations/${id}`);
      return response.data;
    },

      getPopularDestinations: async () => {
    const response = await api.get('/api/destinations/popular');
    return response.data;
  },
  };

  export const propertyService = {
    getAllProperties: async () => {
      try {
        console.log('Making request to:', `${BASE_URL}/api/properties`);
        const response = await api.get('/api/properties');
        console.log('Raw response:', response);
        return response.data;
      } catch (error) {
        console.error('getAllProperties error:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
        throw error;
      }
    },
    
    getFeaturedProperties: async () => {
      const response = await api.get('/api/properties/featured');
      return response.data;
    },
    createProperty: async (formData) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }
  
        console.log('Starting property creation request');
        console.log('Token:', token);
  
        // Log the FormData contents
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
          if (key === 'images') {
            console.log('Image file:', value.name, value.type, value.size);
          } else {
            console.log(`${key}:`, value);
          }
        }
  
        const response = await api.post('/api/properties', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          timeout: 60000, // Increase timeout to 60 seconds
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log('Upload progress:', percentCompleted + '%');
          }
        });
  
        console.log('Response received:', response.data);
        return response.data;
  
      } catch (error) {
        console.error('Full error object:', error);
        
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out - the upload may be too large or the connection is slow');
        }
        
        if (error.response) {
          // Server responded with an error
          console.error('Server error response:', error.response.data);
          throw new Error(error.response.data.message || 'Server error occurred');
        }
        
        if (error.request) {
          // Request was made but no response received
          console.error('No response received:', error.request);
          throw new Error('No response from server - please check your connection');
        }
        
        // Something else went wrong
        throw new Error(error.message || 'Error creating property');
      }
    },
  
    updateProperty: async (id, formData) => {
      const response = await api.put(`/api/properties/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      return response.data;
    },
  
    deleteProperty: async (id) => {
      const response = await api.delete(`/api/properties/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      return response.data;
    },
  
    getProperty: async (id) => {
      try {
        console.log('Making request to:', `${BASE_URL}/api/properties/${id}`);
        const response = await api.get(`/api/properties/${id}`);
        console.log('Raw API response:', response.data);
        return response.data;
      } catch (error) {
        console.error('getProperty error:', error);
        throw error;
      }
    }
  };
  

  export default api;