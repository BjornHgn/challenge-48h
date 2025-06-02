import { Station, StationFilters } from '../types/station';

export const filterStations = (stations: Station[], filters: StationFilters): Station[] => {
  return stations.filter((station) => {
    if (filters.status && station.status !== filters.status) {
      return false;
    }
    
    if (filters.hasAvailableBikes && station.availableBikes <= 0) {
      return false;
    }
    
    if (filters.hasEBikes && station.availableEBikes <= 0) {
      return false;
    }
    
    if (filters.hasAvailableDocks && station.availableDocks <= 0) {
      return false;
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        station.name.toLowerCase().includes(searchLower) ||
        station.address.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
};