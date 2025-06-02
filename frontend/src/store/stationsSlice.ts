import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { stationsApi } from '../services/api';
import { Station } from '../types/station';
import { RootState } from '../store';

interface StationsState {
  stations: Record<string, Station>;
  loading: boolean;
  error: string | null;
}

const initialState: StationsState = {
  stations: {},
  loading: false,
  error: null,
};

export const fetchStations = createAsyncThunk(
  'stations/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await stationsApi.getAll();
      return response.stations;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stations');
    }
  }
);

export const fetchStationById = createAsyncThunk(
  'stations/fetchById',
  async (stationId: string, { rejectWithValue }) => {
    try {
      const response = await stationsApi.getById(stationId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch station');
    }
  }
);

export const fetchNearbyStations = createAsyncThunk(
  'stations/fetchNearby',
  async (
    { longitude, latitude, distance }: { longitude: number; latitude: number; distance?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await stationsApi.getNearby(longitude, latitude, distance);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nearby stations');
    }
  }
);

const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    updateStation: (state, action) => {
      const { _id, ...stationData } = action.payload;
      if (state.stations[_id]) {
        state.stations[_id] = { ...state.stations[_id], ...stationData };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all stations
      .addCase(fetchStations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.loading = false;
        // Convert array to object with IDs as keys
        const stationsMap = action.payload.reduce((acc, station) => {
          acc[station._id] = station;
          return acc;
        }, {} as Record<string, Station>);
        state.stations = stationsMap;
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch station by ID
      .addCase(fetchStationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStationById.fulfilled, (state, action) => {
        state.loading = false;
        state.stations[action.payload._id] = action.payload;
      })
      .addCase(fetchStationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch nearby stations
      .addCase(fetchNearbyStations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyStations.fulfilled, (state, action) => {
        state.loading = false;
        // Add stations to state
        action.payload.forEach((station: Station) => {
          state.stations[station._id] = station;
        });
      })
      .addCase(fetchNearbyStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectAllStations = (stations: Record<string, Station>) => 
  Object.values(stations);

export const selectStationById = (state: RootState, stationId: string) => 
  state.stations.stations[stationId];

export const { updateStation } = stationsSlice.actions;
export default stationsSlice.reducer;