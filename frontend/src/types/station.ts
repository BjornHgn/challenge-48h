export interface Station {
  _id: string;
  stationId: string;
  name: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  status: 'OPEN' | 'CLOSED' | 'MAINTENANCE';
  totalDocks: number;
  availableBikes: number;
  availableEBikes: number;
  availableDocks: number;
  isEBikeStation: boolean;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface StationFilters {
  status?: string;
  hasAvailableBikes?: boolean;
  hasEBikes?: boolean;
  hasAvailableDocks?: boolean;
  searchTerm?: string;
}