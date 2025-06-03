import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { addToFavorites, removeFromFavorites } from '../../store/userSlice';
import { Link } from 'react-router-dom';
import { Station } from '../../types/station';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface StationListProps {
  stations: Station[];
  onStationSelect: (station: Station) => void;
}

const StationList = ({ stations, onStationSelect }: StationListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { favoriteStations } = useSelector((state: RootState) => state.user);

  if (!stations.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No stations found matching your criteria.
      </div>
    );
  }

  const toggleFavorite = (e: React.MouseEvent, stationId: string) => {
    e.stopPropagation(); // Prevent station selection
    
    if (favoriteStations.includes(stationId)) {
      dispatch(removeFromFavorites(stationId));
    } else {
      dispatch(addToFavorites(stationId));
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stations.map(station => (
        <div 
          key={station._id} 
          className="tbm-station-card"
          onClick={() => onStationSelect(station)}
        >
          <div className="tbm-station-header">
            <h3 className="tbm-station-name">{station.name}</h3>
            {isAuthenticated && (
              <button
                onClick={(e) => toggleFavorite(e, station._id)}
                className="p-1"
                aria-label={favoriteStations.includes(station._id) ? "Remove from favorites" : "Add to favorites"}
              >
                {favoriteStations.includes(station._id) ? (
                  <HeartIconSolid className="h-6 w-6 text-secondary-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-neutral-400 hover:text-secondary-500" />
                )}
              </button>
            )}
          </div>
          
          <div className="tbm-station-body">
            <p className="tbm-station-address">{station.address}</p>
            <div className="tbm-station-availability">
              <div className="tbm-availability-item">
                <span className="tbm-availability-value tbm-bikes-value">{station.availableBikes}</span>
                <span className="tbm-availability-label">Vélos</span>
              </div>
              <div className="tbm-availability-item">
                <span className="tbm-availability-value tbm-ebikes-value">{station.availableEBikes}</span>
                <span className="tbm-availability-label">Vélos électriques</span>
              </div>
              <div className="tbm-availability-item">
                <span className="tbm-availability-value tbm-docks-value">{station.availableDocks}</span>
                <span className="tbm-availability-label">Places libres</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StationList;