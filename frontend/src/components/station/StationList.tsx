import React from 'react';
import { Link } from 'react-router-dom';
import { Station } from '../../types/station';

interface StationListProps {
  stations: Station[];
  onStationSelect: (station: Station) => void;
}

const StationList = ({ stations, onStationSelect }: StationListProps) => {
  if (!stations.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No stations found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stations.map(station => (
        <div 
          key={station._id} 
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg"
          onClick={() => onStationSelect(station)}
        >
          <div className="flex items-center mb-2">
            <div 
              className={`w-3 h-3 rounded-full mr-2 ${
                station.status !== 'OPEN' 
                  ? 'bg-neutral-500' 
                  : station.availableBikes === 0 
                  ? 'bg-secondary-500' 
                  : station.availableBikes < 3 
                  ? 'bg-amber-500' 
                  : 'bg-emerald-500'
              }`} 
            />
            <h3 className="text-lg font-bold text-primary-600">{station.name}</h3>
          </div>
          
          <p className="text-sm text-neutral-600 mb-3">{station.address}</p>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xl font-bold text-primary-500">{station.availableBikes}</div>
              <div className="text-xs text-neutral-500">Bikes</div>
            </div>
            <div>
              <div className="text-xl font-bold text-secondary-500">{station.availableEBikes}</div>
              <div className="text-xs text-neutral-500">E-Bikes</div>
            </div>
            <div>
              <div className="text-xl font-bold text-neutral-700">{station.availableDocks}</div>
              <div className="text-xs text-neutral-500">Docks</div>
            </div>
          </div>
          
          <div className="mt-4">
            <Link 
              to={`/stations/${station._id}`}
              className="block w-full text-center py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StationList;