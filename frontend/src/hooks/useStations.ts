import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { 
  fetchStations, 
  fetchStationById, 
  fetchNearbyStations,
  selectAllStations,
  selectStationById,
  selectSelectedStation
} from '../store/stationsSlice';
import { StationFilters } from '../types/station';

export const useStations = (filters?: StationFilters) => {
  const dispatch = useDispatch<AppDispatch>();
  const stations = useSelector(selectAllStations);
  const { loading, error } = useSelector((state: RootState) => state.stations);
  
  useEffect(() => {
    dispatch(fetchStations(filters));
  }, [dispatch, JSON.stringify(filters)]);
  
  return { stations, loading, error };
};

export const useStation = (stationId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const station = useSelector((state: RootState) => selectStationById(state, stationId));
  const { loading, error } = useSelector((state: RootState) => state.stations);
  
  useEffect(() => {
    if (stationId) {
      dispatch(fetchStationById(stationId));
    }
  }, [dispatch, stationId]);
  
  return { station, loading, error };
};

export const useNearbyStations = (longitude?: number, latitude?: number, distance?: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const stations = useSelector(selectAllStations);
  const { loading, error } = useSelector((state: RootState) => state.stations);
  
  useEffect(() => {
    if (longitude && latitude) {
      dispatch(fetchNearbyStations({ longitude, latitude, distance }));
    }
  }, [dispatch, longitude, latitude, distance]);
  
  return { stations, loading, error };
};