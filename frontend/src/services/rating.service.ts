import { ratingsApi } from './api';

export interface StationRating {
  _id: string;
  user_id: string;
  station_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export const ratingService = {
  getStationRatings: async (stationId: string): Promise<StationRating[]> => {
    try {
      const ratings = await ratingsApi.getForStation(stationId);
      return Array.isArray(ratings) ? ratings : [];
    } catch (error) {
      console.error('Error fetching station ratings:', error);
      return [];
    }
  },
  
  addRating: async (stationId: string, rating: number, comment?: string): Promise<StationRating> => {
    return await ratingsApi.addRating(stationId, rating, comment);
  },
  
  deleteRating: async (ratingId: string): Promise<void> => {
    await ratingsApi.deleteRating(ratingId);
  }
};