import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const httpClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for future auth tokens)
httpClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Ensure we always return a proper error object
    if (error.response) {
      // Check if response is a blob (for export endpoints)
      if (error.response.config?.responseType === 'blob' && error.response.data instanceof Blob) {
        try {
          // Try to parse error message from blob
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          return Promise.reject({ 
            message: json.error?.message || json.message || 'Export failed. Please try again.',
            response: error.response 
          });
        } catch {
          // If parsing fails, return generic error
          return Promise.reject({ 
            message: 'Export failed. Please try again.',
            response: error.response 
          });
        }
      }
      // Server responded with error - ensure we have a proper error object
      const errorData = error.response.data;
      if (errorData && typeof errorData === 'object') {
        return Promise.reject({
          message: errorData.error?.message || errorData.message || 'Request failed',
          ...errorData,
          response: error.response
        });
      }
      return Promise.reject({ 
        message: 'Request failed',
        response: error.response 
      });
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({ 
        message: 'Network error. Please check your connection.',
        request: error.request 
      });
    } else {
      // Something else happened - ensure error.message exists
      return Promise.reject({ 
        message: error.message || 'An unexpected error occurred' 
      });
    }
  }
);

export default httpClient;

