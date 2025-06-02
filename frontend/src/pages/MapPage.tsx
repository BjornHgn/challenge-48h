import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchStations, selectAllStations } from '../store/stationsSlice';
import StationMap from '../components/station/StationMap';
import StationFilters from '../components/station/StationFilters';
import StationList from '../components/station/StationList';
import { Station } from '../types/station';
import { filterStations } from '../utils/stationUtils';

const MapPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stations, loading, error } = useSelector((state: RootState) => state.stations);
  const allStations = selectAllStations(stations);
  
  const [activeStation, setActiveStation] = useState<Station | null>(null);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    hasAvailableBikes: false,
    hasEBikes: false,
    hasAvailableDocks: false,
    searchTerm: '',
  });
  
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  
  useEffect(() => {
    dispatch(fetchStations());
    
    // Refresh data every minute
    const interval = setInterval(() => {
      dispatch(fetchStations());
    }, 60000);
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  useEffect(() => {
    setFilteredStations(filterStations(allStations, filters));
  }, [allStations, filters]);
  
  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);
  
  const handleStationSelect = useCallback((station: Station) => {
    setActiveStation(station);
  }, []);
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white shadow-md p-4 mb-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-primary-500">VCub Stations</h1>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg ${viewMode === 'map' 
                ? 'bg-primary-500 text-white' 
                : 'bg-neutral-100 text-neutral-700'}`}
            >
              Map View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg ${viewMode === 'list' 
                ? 'bg-primary-500 text-white' 
                : 'bg-neutral-100 text-neutral-700'}`}
            >
              List View
            </button>
          </div>
        </div>
        
        <StationFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>
      
      {loading && !allStations.length ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="bg-secondary-100 text-secondary-700 p-4 rounded-lg">
          Error loading stations: {error}
        </div>
      ) : (
        <div className="flex-1">
          {viewMode === 'map' ? (
            <StationMap 
              stations={filteredStations} 
              activeStation={activeStation} 
              onStationSelect={handleStationSelect} 
            />
          ) : (
            <StationList 
              stations={filteredStations} 
              onStationSelect={handleStationSelect} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MapPage;