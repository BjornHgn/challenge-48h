import React, { useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Station } from '../services/stationService';

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Composant pour gérer le centrage de la carte
const MapController: React.FC<{ station: Station | null }> = ({ station }) => {
  const map = useMap();

  React.useEffect(() => {
    if (station) {
      const position: [number, number] = [
        station.coordinates.coordinates[1],
        station.coordinates.coordinates[0]
      ];
      map.setView(position, 16, {
        animate: true,
        duration: 1
      });
    }
  }, [station, map]);

  return null;
};

// Icônes personnalisées pour les différents états
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

interface MapProps {
  stations: Station[];
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

const Map: React.FC<MapProps> = ({ stations, center, zoom }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      const stationName = station.name.find(n => n.language === 'fr')?.text || station.name[0].text;
      const stationAddress = station.address.toLowerCase();
      const query = searchQuery.toLowerCase();
      
      return stationName.toLowerCase().includes(query) || 
             stationAddress.includes(query);
    });
  }, [stations, searchQuery]);

  const getStationStatus = (station: Station) => {
    const availability = station.num_vehicles_available / station.capacity;
    if (availability >= 0.5) return 'high';
    if (availability >= 0.2) return 'medium';
    return 'low';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return '#2ecc71';
      case 'medium': return '#f1c40f';
      case 'low': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
  };

  return (
    <div className="map-layout">
      <div className="map-wrapper">
        <div className="search-overlay">
          <input
            type="text"
            placeholder="Rechercher une station..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="map-container" style={{ height: '500px', width: '100%' }}>
          <MapContainer
            center={[center.lat, center.lng]}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
          >
            <MapController station={selectedStation} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredStations.map((station) => {
              const status = getStationStatus(station);
              const icon = createCustomIcon(getStatusColor(status));
              
              return (
                <Marker
                  key={station._id}
                  position={[station.coordinates.coordinates[1], station.coordinates.coordinates[0]]}
                  icon={icon}
                >
                  <Popup>
                    <div className="station-popup">
                      <h3>{station.name.find(n => n.language === 'fr')?.text || station.name[0].text}</h3>
                      <p>{station.address}</p>
                      <div className="station-stats">
                        <div className={`status-indicator status-${status}`}>
                          {station.num_vehicles_available} vélos disponibles
                        </div>
                        <div className="station-info">
                          <p>Places disponibles : {station.num_docks_available}</p>
                          <p>Capacité totale : {station.capacity}</p>
                          {station.is_charging_station && <p>Station de recharge disponible</p>}
                          <p>Dernière mise à jour : {new Date(station.last_reported).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      <div className="stations-list">
        <h3 className="stations-list-title">Stations ({filteredStations.length})</h3>
        <div className="stations-list-container">
          {filteredStations.map((station) => {
            const status = getStationStatus(station);
            const stationName = station.name.find(n => n.language === 'fr')?.text || station.name[0].text;
            
            return (
              <div 
                key={station._id} 
                className={`station-list-item ${selectedStation?._id === station._id ? 'selected' : ''}`}
                onClick={() => handleStationClick(station)}
              >
                <div className="station-list-header">
                  <h4>{stationName}</h4>
                  <span className={`status-badge status-${status}`}>
                    {station.num_vehicles_available} vélos
                  </span>
                </div>
                <p className="station-list-address">{station.address}</p>
                <div className="station-list-details">
                  <span>Places : {station.num_docks_available}/{station.capacity}</span>
                  {station.is_charging_station && <span className="charging-badge">Recharge</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Map; 