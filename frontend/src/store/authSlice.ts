import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../services/api';

// Update thunks to use authApi
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { user, accessToken } = await authApi.login(email, password);
      return user;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Login failed');
      }
      return rejectWithValue('Connection error. Please try again.');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const { user, accessToken } = await authApi.register(username, email, password);
      return user;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.response) {
        // Server responded with an error
        const message = error.response.data.message;
        if (Array.isArray(message)) {
          return rejectWithValue(message.join(', '));
        }
        return rejectWithValue(message || 'Registration failed');
      }
      
      // Network error or other issues
      return rejectWithValue('Connection error. Please check your internet connection.');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout', 
  async () => {
    await authApi.logout();
  }
);

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.getCurrentUser();
    } catch (error) {
      return rejectWithValue('Not authenticated');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.isAuthenticated = false;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;