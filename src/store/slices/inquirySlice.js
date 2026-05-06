import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inquiryAPI } from '../../services/api';

// Async thunks for inquiries
export const fetchInquiries = createAsyncThunk(
  'inquiries/fetchInquiries',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await inquiryAPI.getAll(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch inquiries');
    }
  }
);

export const fetchInquiryById = createAsyncThunk(
  'inquiries/fetchInquiryById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await inquiryAPI.getById(id);
      return response.data.data.inquiry;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch inquiry');
    }
  }
);

export const createInquiry = createAsyncThunk(
  'inquiries/createInquiry',
  async (data, { rejectWithValue }) => {
    try {
      const response = await inquiryAPI.create(data);
      return response.data.data.inquiry;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create inquiry');
    }
  }
);

export const updateInquiry = createAsyncThunk(
  'inquiries/updateInquiry',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await inquiryAPI.update(id, data);
      return response.data.data.inquiry;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update inquiry');
    }
  }
);

export const deleteInquiry = createAsyncThunk(
  'inquiries/deleteInquiry',
  async (id, { rejectWithValue }) => {
    try {
      await inquiryAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete inquiry');
    }
  }
);

export const fetchInquiryStats = createAsyncThunk(
  'inquiries/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await inquiryAPI.getStats();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch stats');
    }
  }
);

export const fetchPendingFollowUps = createAsyncThunk(
  'inquiries/fetchPendingFollowUps',
  async (_, { rejectWithValue }) => {
    try {
      const response = await inquiryAPI.getPendingFollowUps();
      return response.data.data.pendingFollowUps;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch pending follow-ups');
    }
  }
);

const inquirySlice = createSlice({
  name: 'inquiries',
  initialState: {
    inquiries: [],
    inquiry: null,
    stats: {
      total: 0,
      new: 0,
      contacted: 0,
      followUp: 0,
      converted: 0,
      closed: 0,
      breakdown: [],
      recent: [],
    },
    pendingFollowUps: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNext: false,
      hasPrev: false,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearInquiry: (state) => {
      state.inquiry = null;
    },
    clearInquiries: (state) => {
      state.inquiries = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all inquiries
      .addCase(fetchInquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries = action.payload.inquiries;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchInquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch inquiry by ID
      .addCase(fetchInquiryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInquiryById.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiry = action.payload;
      })
      .addCase(fetchInquiryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create inquiry
      .addCase(createInquiry.fulfilled, (state, action) => {
        state.inquiries.unshift(action.payload);
      })
      .addCase(createInquiry.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update inquiry
      .addCase(updateInquiry.fulfilled, (state, action) => {
        const index = state.inquiries.findIndex(inquiry => inquiry._id === action.payload._id);
        if (index !== -1) {
          state.inquiries[index] = action.payload;
        }
        if (state.inquiry && state.inquiry._id === action.payload._id) {
          state.inquiry = action.payload;
        }
      })
      .addCase(updateInquiry.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete inquiry
      .addCase(deleteInquiry.fulfilled, (state, action) => {
        state.inquiries = state.inquiries.filter(inquiry => inquiry._id !== action.payload);
      })
      .addCase(deleteInquiry.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch stats
      .addCase(fetchInquiryStats.fulfilled, (state, action) => {
        // The payload structure is { stats: {...}, recent: [...], weeklyData: [...] }
        // So we need to extract the parts we want
        state.stats = {
          ...state.stats,
          ...action.payload.stats,
          recent: action.payload.recent,
          weeklyData: action.payload.weeklyData
        };
      })
      .addCase(fetchInquiryStats.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch pending follow-ups
      .addCase(fetchPendingFollowUps.fulfilled, (state, action) => {
        state.pendingFollowUps = action.payload;
      })
      .addCase(fetchPendingFollowUps.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearInquiry, clearInquiries } = inquirySlice.actions;
export default inquirySlice.reducer;