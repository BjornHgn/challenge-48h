import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Station } from '../../types/station';
import { addToFavorites, removeFromFavorites } from '../../store/userSlice';
import { AppDispatch, RootState } from '../../store';
import StationCard from './StationCard';
import { getUserLocation } from '../../utils/locationUtils';

// Fix default marker icon issue in Leaflet with React
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Replace default icon
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// Helper component to update map view when props change
const MapUpdater = ({ center, zoom }: { center?: [number, number], zoom?: number }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  
  return null;
};

// Create custom marker icons based on station status
const createStationIcon = (station: Station) => {
  let color = '#0066B3'; // Default blue
  
  if (station.status !== 'OPEN') {
    color = '#6C757D'; // Gray for closed/maintenance
  } else if (station.availableBikes === 0) {
    color = '#DC3545'; // Red for no bikes
  } else if (station.availableBikes < 3) {
    color = '#FFC107'; // Yellow for low availability
  } else if (station.availableBikes > 10) {
    color = '#28A745'; // Green for high availability
  }
  
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold;">${station.availableBikes}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

interface StationMapProps {
  stations: Station[];
  activeStation: Station | null;
  onStationSelect: (station: Station) => void;
}

const StationMap = ({ stations, activeStation, onStationSelect }: StationMapProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { favoriteStations } = useSelector((state: RootState) => state.user);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([44.837789, -0.57918]); // Bordeaux center
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  // Get user location on component mount
  useEffect(() => {
    getUserLocation()
      .then(location => {
        setUserLocation(location);
        setMapCenter(location);
      })
      .catch(error => {
        console.error('Error getting user location:', error);
      });
  }, []);
  
  // Update map center when active station changes
  useEffect(() => {
    if (activeStation) {
      setMapCenter([
        activeStation.location.coordinates[1],
        activeStation.location.coordinates[0]
      ]);
    }
  }, [activeStation]);
  
  // Check if a station is a favorite
  const isFavorite = (stationId: string) => {
    return favoriteStations.includes(stationId);
  };
  
  // Toggle station as favorite
  const toggleFavorite = (stationId: string) => {
    if (isFavorite(stationId)) {
      dispatch(removeFromFavorites(stationId));
    } else {
      dispatch(addToFavorites(stationId));
    }
  };
  
  // Memoize station markers to prevent unnecessary re-renders
  const stationMarkers = useMemo(() => (
    stations.map(station => (
      <Marker
        key={station._id}
        position={[
          station.location.coordinates[1],
          station.location.coordinates[0]
        ]}
        icon={createStationIcon(station)}
        eventHandlers={{
          click: () => onStationSelect(station)
        }}
      >
        <Popup>
          <div className="min-w-[200px]">
            <div className="text-center mb-2">
              <h3 className="font-bold text-lg text-primary-500">
                {station.name}
              </h3>
              <p className="text-sm text-neutral-500">
                {station.address}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-2 text-center">
              <div>
                <div className="font-bold text-lg">{station.availableBikes}</div>
                <div className="text-xs">Bikes</div>
              </div>
              <div>
                <div className="font-bold text-lg">{station.availableEBikes}</div>
                <div className="text-xs">E-Bikes</div>
              </div>
              <div>
                <div className="font-bold text-lg">{station.availableDocks}</div>
                <div className="text-xs">Docks</div>
              </div>
            </div>
            
            <div className="flex justify-between mt-3">
              {isAuthenticated && (
                <button 
                  className={`px-3 py-1 text-sm rounded-lg ${
                    isFavorite(station._id) 
                      ? 'bg-secondary-500 text-white' 
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                  onClick={() => toggleFavorite(station._id)}
                >
                  {isFavorite(station._id) ? '★ Favorite' : '☆ Add to Favorites'}
                </button>
              )}
              
              <Link 
                to={`/stations/${station._id}`}
                className="px-3 py-1 text-sm rounded-lg bg-primary-500 text-white"
              >
                Details
              </Link>
            </div>
          </div>
        </Popup>
      </Marker>
    ))
  ), [stations, isAuthenticated, favoriteStations, onStationSelect, toggleFavorite]);
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        <MapContainer 
          center={mapCenter} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={L.divIcon({
                className: 'user-location-icon',
                html: `<div style="background-color: #0066B3; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              })}
            >
              <Popup>Your location</Popup>
            </Marker>
          )}
          
          {/* Station markers */}
          {stationMarkers}
          
          {/* Map updater */}
          <MapUpdater center={mapCenter} zoom={15} />
        </MapContainer>
      </div>
      
      {/* Active station details */}
      {activeStation && (
        <div className="p-4 bg-white shadow-lg rounded-lg mt-4">
          <StationCard 
            station={activeStation}
            onClose={() => onStationSelect(null)}
            showDetails={false}
          />
        </div>
      )}
    </div>
  );
};

export default StationMap;