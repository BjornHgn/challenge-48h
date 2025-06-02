import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { XMarkIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Station } from '../../types/station';
import { addToFavorites, removeFromFavorites } from '../../store/userSlice';
import { AppDispatch, RootState } from '../../store';
import { formatDistance } from '../../utils/locationUtils';
import { formatDate } from '../../utils/dateUtils';
import { useSocketUpdates } from '../../hooks/useSocketUpdates';

interface StationCardProps {
  station: Station;
  showDistance?: boolean;
  userCoordinates?: [number, number];
  onClose?: () => void;
  showDetails?: boolean;
}

const StationCard = ({
  station,
  showDistance = false,
  userCoordinates,
  onClose,
  showDetails = true,
}: StationCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { favoriteStations } = useSelector((state: RootState) => state.user);
  
  // Get real-time updates for this station
  const updatedStation = useSocketUpdates(station);
  
  // Calculate bike occupancy percentage
  const occupancyRate = Math.round(
    (updatedStation.availableBikes / updatedStation.totalDocks) * 100
  );
  
  // Check if station is in favorites
  const isFavorite = favoriteStations.includes(updatedStation._id);
  
  // Toggle favorite status
  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(updatedStation._id));
    } else {
      dispatch(addToFavorites(updatedStation._id));
    }
  };
  
  // Get status color
  const getStatusColor = () => {
    if (updatedStation.status !== 'OPEN') return 'bg-neutral-500';
    if (updatedStation.availableBikes === 0) return 'bg-secondary-500';
    if (updatedStation.availableBikes < 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 relative">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 rounded-full bg-neutral-100 hover:bg-neutral-200"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5 text-neutral-500" />
          </button>
        )}
        
        {/* Status indicator and title */}
        <div className="flex items-center mb-2">
          <div 
            className={`w-3 h-3 rounded-full mr-2 ${getStatusColor()}`} 
            aria-hidden="true"
          ></div>
          <h3 className="text-lg font-bold text-primary-600">{updatedStation.name}</h3>
          
          {/* Favorite button */}
          {isAuthenticated && (
            <button 
              onClick={toggleFavorite}
              className="ml-auto p-1"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? (
                <HeartSolidIcon className="h-6 w-6 text-secondary-500" />
              ) : (
                <HeartIcon className="h-6 w-6 text-neutral-400 hover:text-secondary-500" />
              )}
            </button>
          )}
        </div>
        
        {/* Address */}
        <p className="text-sm text-neutral-600 mb-3">{updatedStation.address}</p>
        
        {/* Status text */}
        <div className="mb-4">
          <span 
            className={`inline-block px-2 py-1 text-xs rounded-full ${
              updatedStation.status === 'OPEN' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-neutral-100 text-neutral-800'
            }`}
          >
            {updatedStation.status}
          </span>
          
          {/* Distance (if enabled) */}
          {showDistance && userCoordinates && (
            <span className="text-xs text-neutral-500 ml-2">
              {formatDistance(
                userCoordinates,
                [
                  updatedStation.location.coordinates[1],
                  updatedStation.location.coordinates[0]
                ]
              )}
            </span>
          )}
        </div>
        
        {/* Availability indicators */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-500">
              {updatedStation.availableBikes}
            </div>
            <div className="text-xs text-neutral-500">Available Bikes</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-500">
              {updatedStation.availableEBikes}
            </div>
            <div className="text-xs text-neutral-500">E-Bikes</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-neutral-700">
              {updatedStation.availableDocks}
            </div>
            <div className="text-xs text-neutral-500">Available Docks</div>
          </div>
        </div>
        
        {/* Occupancy bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-neutral-500 mb-1">
            <span>Bike Occupancy</span>
            <span>{occupancyRate}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full" 
              style={{ width: `${occupancyRate}%` }}
            ></div>
          </div>
        </div>
        
        {/* Last updated */}
        <div className="text-xs text-neutral-500 mt-2">
          Last updated: {formatDate(updatedStation.lastUpdated)}
        </div>
        
        {/* Details link */}
        {showDetails && (
          <div className="mt-4">
            <Link
              to={`/stations/${updatedStation._id}`}
              className="block w-full text-center py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationCard;