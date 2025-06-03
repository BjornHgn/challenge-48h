import axios from 'axios';
import { Station } from '../types/station';
import { User } from '../types/user';

const API_URL = 'http://10.33.70.223:3000/docs/';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor to add auth token
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

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not a retry, attempt to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Call the refresh token endpoint
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        // Update the access token in localStorage
        localStorage.setItem('accessToken', response.data.accessToken);
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear auth data and redirect to login
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authApi = {
  register: async (data: { email: string; username: string; password: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data;
  },
  
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },
  
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Stations API calls
export const stationsApi = {
  getAll: async (params?: any): Promise<{ stations: Station[]; pagination: any }> => {
    const response = await api.get('/stations', { params });
    return response.data;
  },
  
  getById: async (id: string): Promise<Station> => {
    const response = await api.get(`/stations/${id}`);
    return response.data;
  },
  
  getNearby: async (
    longitude: number,
    latitude: number,
    distance: number = 1000
  ): Promise<Station[]> => {
    const response = await api.get('/stations/nearby', {
      params: { longitude, latitude, distance },
    });
    return response.data;
  },
  
  getFavorites: async (): Promise<Station[]> => {
    const response = await api.get('/stations/favorites');
    return response.data;
  },
  
  addToFavorites: async (stationId: string): Promise<{ message: string }> => {
    const response = await api.post(`/stations/favorites/${stationId}`);
    return response.data;
  },
  
  removeFromFavorites: async (stationId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/stations/favorites/${stationId}`);
    return response.data;
  },
};

export default api;
