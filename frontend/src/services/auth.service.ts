import api from './api';
import { User } from '../types/user';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, user } = response.data;
    localStorage.setItem('accessToken', accessToken);
    return user;
  },
  
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    const { accessToken, user } = response.data;
    localStorage.setItem('accessToken', accessToken);
    return user;
  },
  
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  checkAuth: async (): Promise<boolean> => {
    try {
      await api.get('/auth/me');
      return true;
    } catch (error) {
      return false;
    }
  }
};