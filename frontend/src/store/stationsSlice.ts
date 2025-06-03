import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { stationService } from '../services/station.service';
import { Station, StationFilters } from '../types/station';
import { RootState } from './index';

// Create adapter for normalized state
const stationsAdapter = createEntityAdapter<Station>({
  selectId: (station) => station._id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

// Async thunks
export const fetchStations = createAsyncThunk(
  'stations/fetchAll',
  async (filters?: StationFilters, { rejectWithValue }) => {
    try {
      const response = await stationService.getAllStations(filters);
      return response.stations;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stations');
    }
  }
);

export const fetchStationById = createAsyncThunk(
  'stations/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await stationService.getStationById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch station');
    }
  }
);

export const fetchNearbyStations = createAsyncThunk(
  'stations/fetchNearby',
  async ({ longitude, latitude, distance }: { longitude: number; latitude: number; distance?: number }, { rejectWithValue }) => {
    try {
      return await stationService.getNearbyStations(longitude, latitude, distance);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nearby stations');
    }
  }
);

export const fetchFavoriteStations = createAsyncThunk(
  'stations/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      return await stationService.getFavoriteStations();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorite stations');
    }
  }
);

// Create slice
const stationsSlice = createSlice({
  name: 'stations',
  initialState: stationsAdapter.getInitialState({
    loading: false,
    error: null as string | null,
    selectedStationId: null as string | null,
  }),
  reducers: {
    // For WebSocket updates
    stationUpdated: stationsAdapter.updateOne,
    selectStation: (state, action) => {
      state.selectedStationId = action.payload;
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
        stationsAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch single station
      .addCase(fetchStationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStationById.fulfilled, (state, action) => {
        stationsAdapter.upsertOne(state, action.payload);
        state.selectedStationId = action.payload._id;
        state.loading = false;
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
        stationsAdapter.upsertMany(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchNearbyStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch favorite stations
      .addCase(fetchFavoriteStations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteStations.fulfilled, (state, action) => {
        stationsAdapter.upsertMany(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchFavoriteStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const {
  selectAll: selectAllStations,
  selectById: selectStationById,
  selectIds: selectStationIds,
} = stationsAdapter.getSelectors((state: RootState) => state.stations);

// Selected station selector
export const selectSelectedStation = createSelector(
  [(state: RootState) => state.stations.selectedStationId, selectAllStations],
  (selectedId, stations) => {
    if (!selectedId) return null;
    return stations.find(station => station._id === selectedId) || null;
  }
);

// Export actions
export const { stationUpdated, selectStation } = stationsSlice.actions;

export default stationsSlice.reducer;