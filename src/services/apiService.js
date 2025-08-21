import axios from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT } from '../config/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Could not retrieve auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      throw error.response.data;
    } else if (error.request) {
      // Request was made but no response
      console.error('Network Error:', error.request);
      throw { message: 'Network error. Please check your connection.' };
    } else {
      // Something else happened
      console.error('Error:', error.message);
      throw { message: error.message };
    }
  }
);

export default apiClient;