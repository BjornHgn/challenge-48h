import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stationsApi } from '../services/api';

interface UserState {
  favoriteStations: string[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  favoriteStations: [],
  loading: false,
  error: null,
};

export const fetchFavoriteStations = createAsyncThunk(
  'user/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const stations = await stationsApi.getFavorites();
      return stations.map(station => station._id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'user/addToFavorites',
  async (stationId: string, { rejectWithValue }) => {
    try {
      await stationsApi.addToFavorites(stationId);
      return stationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to favorites');
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'user/removeFromFavorites',
  async (stationId: string, { rejectWithValue }) => {
    try {
      await stationsApi.removeFromFavorites(stationId);
      return stationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from favorites');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavoriteStations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteStations.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteStations = action.payload;
      })
      .addCase(fetchFavoriteStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add to favorites
      .addCase(addToFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.favoriteStations.includes(action.payload)) {
          state.favoriteStations.push(action.payload);
        }
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Remove from favorites
      .addCase(removeFromFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteStations = state.favoriteStations.filter(id => id !== action.payload);
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;