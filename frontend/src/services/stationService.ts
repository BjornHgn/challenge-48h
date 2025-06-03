import axios from 'axios';

const API_URL = 'http://10.33.70.223:3000/api';

export interface Station {
  _id: string;
  station_id: string;
  name: Array<{
    text: string;
    language: string;
  }>;
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
  address: string;
  post_code: string;
  capacity: number;
  num_vehicles_available: number;
  num_docks_available: number;
  is_installed: boolean;
  is_renting: boolean;
  is_returning: boolean;
  is_charging_station: boolean;
  last_reported: string;
  vehicle_types_available: Array<{
    vehicle_type_id: string;
    count: number;
  }>;
}

export const stationService = {
  async getAllStations(): Promise<Station[]> {
    try {
      const response = await axios.get(`${API_URL}/stations`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des stations:', error);
      throw error;
    }
  },

  async getStationById(id: string): Promise<Station> {
    try {
      const response = await axios.get(`${API_URL}/stations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la station ${id}:`, error);
      throw error;
    }
  }
}; 