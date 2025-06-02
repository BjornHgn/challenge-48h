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
          className="tbm-station-card"
          onClick={() => onStationSelect(station)}
        >
          <div className="tbm-station-header">
            <h3 className="tbm-station-name">{station.name}</h3>
            <span className={`tbm-station-status ${station.status === 'OPEN' ? 'tbm-station-status-open' : 'tbm-station-status-closed'}`}>
              {station.status}
            </span>
          </div>
          
          <div className="tbm-station-body">
            <p className="tbm-station-address">{station.address}</p>
            
            <div className="tbm-station-availability">
              <div className="tbm-availability-item">
                <div className="tbm-availability-value tbm-bikes-value">{station.availableBikes}</div>
                <div className="tbm-availability-label">Bikes</div>
              </div>
              <div className="tbm-availability-item">
                <div className="tbm-availability-value tbm-ebikes-value">{station.availableEBikes}</div>
                <div className="tbm-availability-label">E-Bikes</div>
              </div>
              <div className="tbm-availability-item">
                <div className="tbm-availability-value tbm-docks-value">{station.availableDocks}</div>
                <div className="tbm-availability-label">Docks</div>
              </div>
            </div>
            
            <div className="tbm-station-actions">
              <Link 
                to={`/stations/${station._id}`}
                className="tbm-btn tbm-btn-primary"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StationList;