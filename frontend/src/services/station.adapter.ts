import { Station } from '../types/station';

/**
 * Adapts the external API station format to our frontend format
 */
export function adaptStation(externalStation: any): Station {
  // Handle potentially different formats
  const coordinates = externalStation.coordinates?.coordinates || 
                    (externalStation.location?.coordinates || [0, 0]);
  
  // Map vehicle counts
  let availableBikes = 0;
  let availableEBikes = 0;
  
  if (Array.isArray(externalStation.vehicle_types_available)) {
    externalStation.vehicle_types_available.forEach((vt: any) => {
      if (vt.vehicle_type_id === 'classic' || vt.vehicle_type_id === 'regular') {
        availableBikes = vt.count;
      } else if (vt.vehicle_type_id === 'electric' || vt.vehicle_type_id === 'ebike') {
        availableEBikes = vt.count;
      }
    });
  }
  
  // Create our standardized station object
  return {
    _id: externalStation._id || externalStation.station_id,
    station_id: externalStation.station_id,
    name: getLocalizedName(externalStation.name) || externalStation.station_id || 'Unknown Station',
    address: externalStation.address || '',
    location: {
      type: 'Point',
      coordinates: coordinates,
    },
    status: getStatus(externalStation),
    availableBikes: externalStation.num_bikes_available || availableBikes || 0,
    availableEBikes: availableEBikes || 0,
    availableDocks: externalStation.num_docks_available || 0,
    totalDocks: externalStation.capacity || 0,
    lastUpdated: externalStation.last_reported || new Date().toISOString(),
  };
}

/**
 * Gets a localized name from the name array
 */
function getLocalizedName(name: any, lang = 'fr'): string {
  if (!name) return '';
  
  // If it's a string, return it directly
  if (typeof name === 'string') return name;
  
  // If it's an array of localized names
  if (Array.isArray(name)) {
    const localizedName = name.find(n => n.language === lang);
    return localizedName ? localizedName.text : (name[0]?.text || '');
  }
  
  return '';
}

/**
 * Determines station status from various fields
 */
function getStatus(station: any): 'OPEN' | 'CLOSED' | 'MAINTENANCE' {
  if (station.status) return station.status;
  
  if (station.is_installed === false) return 'MAINTENANCE';
  if (station.is_renting === false && station.is_returning === false) return 'CLOSED';
  
  return 'OPEN';
}