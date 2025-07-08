import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient, User } from '@/lib/api';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  role: localStorage.getItem('role'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  user: User;
  token: string;
}

interface AuthError {
  message: string;
  status?: number;
}

// Async thunks
export const loginUser = createAsyncThunk<LoginResponse, { email: string; password: string }>(
  'auth/login',
  async ({ email, password }) => {
    const response = await apiClient.login(email, password);
    return response;
  }
);

export const registerUser = createAsyncThunk<RegisterResponse, unknown>(
  'auth/register',
  async (userData) => {
    const response = await apiClient.register(userData);
    return response;
  }
);

export const getCurrentUser = createAsyncThunk<User, void, { rejectValue: AuthError }>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.getCurrentUser();
      return response;
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
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;

        // Store token in localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', action.payload.user.role);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })

      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;

        // Store token in localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', action.payload.user.role);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })

      // getCurrentUser cases
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload?.message || 'Authentication failed';

        // Remove invalid token
        localStorage.removeItem('token');
      })
      
      // Handle logout
      .addCase(logout, (state) => {
        localStorage.removeItem('token');
        localStorage.removeItem('role'); // Clear role on logout
        state.user = null;
        state.token = null;
        state.role = null; // Reset role
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
