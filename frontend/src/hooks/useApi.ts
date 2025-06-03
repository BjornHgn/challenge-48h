import { useState, useEffect } from 'react';
import { stationsApi } from '../services/api';
import { Station } from '../types/station';

export const useStations = (filters?: {
  status?: string;
  hasEBikes?: boolean;
  hasAvailableBikes?: boolean;
  hasAvailableDocks?: boolean;
  page?: number;
  limit?: number;
}) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const result = await stationsApi.getAll(filters);
        setStations(result.stations);
        setPagination(result.pagination);
        setError(null);
      } catch (err) {
        console.error('Error fetching stations:', err);
        setError('Failed to fetch stations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [
    filters?.status,
    filters?.hasEBikes,
    filters?.hasAvailableBikes,
    filters?.hasAvailableDocks,
    filters?.page,
    filters?.limit,
  ]);

  return { stations, loading, error, pagination };
};

export const useStation = (stationId: string) => {
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStation = async () => {
      try {
        setLoading(true);
        const result = await stationsApi.getById(stationId);
        setStation(result);
        setError(null);
      } catch (err) {
        console.error(`Error fetching station ${stationId}:`, err);
        setError('Failed to fetch station details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (stationId) {
      fetchStation();
    }
  }, [stationId]);

  return { station, loading, error };
};

export const useNearbyStations = (
  longitude?: number,
  latitude?: number,
  distance: number = 1000
) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNearbyStations = async () => {
      if (!longitude || !latitude) return;
      
      try {
        setLoading(true);
        const result = await stationsApi.getNearby(longitude, latitude, distance);
        setStations(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching nearby stations:', err);
        setError('Failed to fetch nearby stations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyStations();
  }, [longitude, latitude, distance]);

  return { stations, loading, error };
};