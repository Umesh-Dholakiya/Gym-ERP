import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { trainerAPI } from '../../services/api';

// Async thunks
export const fetchTrainers = createAsyncThunk(
  'trainers/fetchTrainers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await trainerAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTrainerById = createAsyncThunk(
  'trainers/fetchTrainerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await trainerAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTrainer = createAsyncThunk(
  'trainers/createTrainer',
  async (trainerData, { rejectWithValue }) => {
    try {
      const response = await trainerAPI.create(trainerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTrainer = createAsyncThunk(
  'trainers/updateTrainer',
  async ({ id, trainerData }, { rejectWithValue }) => {
    try {
      const response = await trainerAPI.update(id, trainerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTrainer = createAsyncThunk(
  'trainers/deleteTrainer',
  async (id, { rejectWithValue }) => {
    try {
      const response = await trainerAPI.delete(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTrainerStats = createAsyncThunk(
  'trainers/fetchTrainerStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await trainerAPI.getStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  trainers: [],
  trainer: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTrainers: 0,
    hasNext: false,
    hasPrev: false
  }
};

// Slice
const trainerSlice = createSlice({
  name: 'trainers',
  initialState,
  reducers: {
    clearTrainer: (state) => {
      state.trainer = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch trainers
      .addCase(fetchTrainers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.loading = false;
        state.trainers = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch trainers';
      })
      // Fetch trainer by ID
      .addCase(fetchTrainerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainerById.fulfilled, (state, action) => {
        state.loading = false;
        state.trainer = action.payload.data;
      })
      .addCase(fetchTrainerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch trainer';
      })
      // Create trainer
      .addCase(createTrainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrainer.fulfilled, (state, action) => {
        state.loading = false;
        state.trainers.unshift(action.payload.data);
        state.pagination.totalTrainers += 1;
      })
      .addCase(createTrainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create trainer';
      })
      // Update trainer
      .addCase(updateTrainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrainer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trainers.findIndex(trainer => trainer._id === action.payload.data._id);
        if (index !== -1) {
          state.trainers[index] = action.payload.data;
        }
        if (state.trainer && state.trainer._id === action.payload.data._id) {
          state.trainer = action.payload.data;
        }
      })
      .addCase(updateTrainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update trainer';
      })
      // Delete trainer
      .addCase(deleteTrainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrainer.fulfilled, (state, action) => {
        state.loading = false;
        state.trainers = state.trainers.filter(trainer => trainer._id !== action.payload.id);
        state.pagination.totalTrainers -= 1;
      })
      .addCase(deleteTrainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete trainer';
      })
      // Fetch trainer stats
      .addCase(fetchTrainerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchTrainerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch trainer stats';
      });
  }
});

export const { clearTrainer, clearError, setCurrentPage } = trainerSlice.actions;
export default trainerSlice.reducer;