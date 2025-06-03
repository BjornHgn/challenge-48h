import axios from 'axios';
import { Station } from '../types/station';

const API_URL = 'http://10.33.70.223:3000/docs/';

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Remove token but don't redirect automatically
        localStorage.removeItem('accessToken');
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
  
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  }
};

// Stations API - keeping the same implementation
export const stationsApi = {
  getAll: async (params?: any) => {
    const response = await api.get('/stations', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/stations/${id}`);
    return response.data;
  },
  
  getNearby: async (longitude: number, latitude: number, distance: number = 1000) => {
    const response = await api.get('/stations/nearby', {
      params: { longitude, latitude, distance },
    });
    return response.data;
  },
  
  getFavorites: async () => {
    const response = await api.get('/stations/favorites');
    return response.data;
  },
  
  addToFavorites: async (stationId: string) => {
    const response = await api.post(`/stations/favorites/${stationId}`);
    return response.data;
  },
  
  removeFromFavorites: async (stationId: string) => {
    const response = await api.delete(`/stations/favorites/${stationId}`);
    return response.data;
  }
};

// Export the base api for custom calls
export default api;
