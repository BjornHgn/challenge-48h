import api from './api';
import { Station, StationFilters } from '../types/station';

export const stationService = {
  getAllStations: async (filters?: StationFilters) => {
    const response = await api.get('/stations', { params: filters });
    return response.data;
  },
  
  getStationById: async (id: string): Promise<Station> => {
    const response = await api.get(`/stations/${id}`);
    return response.data;
  },
  
  getNearbyStations: async (longitude: number, latitude: number, distance: number = 1000) => {
    const response = await api.get('/stations/nearby', {
      params: { longitude, latitude, distance }
    });
    return response.data;
  },
  
  getFavoriteStations: async () => {
    const response = await api.get('/stations/favorites');
    return response.data;
  },
  
  addToFavorites: async (stationId: string) => {
    await api.post(`/stations/favorites/${stationId}`);
  },
  
  removeFromFavorites: async (stationId: string) => {
    await api.delete(`/stations/favorites/${stationId}`);
  }
};