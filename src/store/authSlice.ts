
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient, User } from '@/lib/api';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await apiClient.login(email, password);
    return response;
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: unknown) => {
    const response = await apiClient.register(userData);
    return response;
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found');
      }

      // Make sure your API call includes the token
      const response = await fetch('/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid
          localStorage.removeItem('token');
          throw new Error('Invalid token');
        }
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message,
        status: error.status || 500,
      });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        
        // Store token in localStorage
        localStorage.setItem('token', action.payload.token);
      })
      
      // getCurrentUser cases - this is the key part!
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user || action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        // This is crucial - when getCurrentUser fails, clean up
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload?.message || 'Authentication failed';
        
        // Remove invalid token
        localStorage.removeItem('token');
      });
  },
});

export const { setToken, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
