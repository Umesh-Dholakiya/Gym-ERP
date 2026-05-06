import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { serviceAPI } from '../../services/api';

// Async thunks for services
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await serviceAPI.getAll(params);
      return response.data.data.services;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch services');
    }
  }
);

export const fetchActiveServices = createAsyncThunk(
  'services/fetchActiveServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await serviceAPI.getActive();
      return response.data.data.services;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch active services');
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  'services/fetchServiceById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await serviceAPI.getById(id);
      return response.data.data.service;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch service');
    }
  }
);

export const createService = createAsyncThunk(
  'services/createService',
  async (data, { rejectWithValue }) => {
    try {
      const response = await serviceAPI.create(data);
      return response.data.data.service;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create service');
    }
  }
);

export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await serviceAPI.update(id, data);
      return response.data.data.service;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update service');
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (id, { rejectWithValue }) => {
    try {
      await serviceAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete service');
    }
  }
);

export const fetchServiceStats = createAsyncThunk(
  'services/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await serviceAPI.getStats();
      return response.data.data.stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch service stats');
    }
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    services: [],
    activeServices: [],
    service: null,
    stats: {
      total: 0,
      active: 0,
      inactive: 0,
      byCategory: [],
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearService: (state) => {
      state.service = null;
    },
    clearServices: (state) => {
      state.services = [];
      state.activeServices = [];
    },
    setActiveServices: (state, action) => {
      state.activeServices = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch active services
      .addCase(fetchActiveServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveServices.fulfilled, (state, action) => {
        state.loading = false;
        state.activeServices = action.payload;
      })
      .addCase(fetchActiveServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch service by ID
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.service = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create service
      .addCase(createService.fulfilled, (state, action) => {
        state.services.push(action.payload);
        if (action.payload.isActive) {
          state.activeServices.push(action.payload);
        }
      })
      .addCase(createService.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update service
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.services.findIndex(service => service._id === action.payload._id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
        
        const activeIndex = state.activeServices.findIndex(service => service._id === action.payload._id);
        if (activeIndex !== -1) {
          if (action.payload.isActive) {
            state.activeServices[activeIndex] = action.payload;
          } else {
            state.activeServices.splice(activeIndex, 1);
          }
        } else if (action.payload.isActive) {
          state.activeServices.push(action.payload);
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete service
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter(service => service._id !== action.payload);
        state.activeServices = state.activeServices.filter(service => service._id !== action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch service stats
      .addCase(fetchServiceStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchServiceStats.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearService, clearServices, setActiveServices } = serviceSlice.actions;
export default serviceSlice.reducer;