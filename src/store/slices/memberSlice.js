import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { memberAPI } from '../../services/api';

// Async thunks
export const fetchMembers = createAsyncThunk(
  'members/fetchMembers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await memberAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMemberById = createAsyncThunk(
  'members/fetchMemberById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await memberAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createMember = createAsyncThunk(
  'members/createMember',
  async (memberData, { rejectWithValue }) => {
    try {
      const response = await memberAPI.create(memberData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateMember = createAsyncThunk(
  'members/updateMember',
  async ({ id, memberData }, { rejectWithValue }) => {
    try {
      const response = await memberAPI.update(id, memberData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteMember = createAsyncThunk(
  'members/deleteMember',
  async (id, { rejectWithValue }) => {
    try {
      const response = await memberAPI.delete(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMemberStats = createAsyncThunk(
  'members/fetchMemberStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await memberAPI.getStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  members: [],
  member: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalMembers: 0,
    hasNext: false,
    hasPrev: false
  }
};

// Slice
const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    clearMember: (state) => {
      state.member = null;
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
      // Fetch members
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch members';
      })
      // Fetch member by ID
      .addCase(fetchMemberById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberById.fulfilled, (state, action) => {
        state.loading = false;
        state.member = action.payload.data;
      })
      .addCase(fetchMemberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch member';
      })
      // Create member
      .addCase(createMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members.unshift(action.payload.data);
        state.pagination.totalMembers += 1;
      })
      .addCase(createMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create member';
      })
      // Update member
      .addCase(updateMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.members.findIndex(member => member._id === action.payload.data._id);
        if (index !== -1) {
          state.members[index] = action.payload.data;
        }
        if (state.member && state.member._id === action.payload.data._id) {
          state.member = action.payload.data;
        }
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update member';
      })
      // Delete member
      .addCase(deleteMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members = state.members.filter(member => member._id !== action.payload.id);
        state.pagination.totalMembers -= 1;
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete member';
      })
      // Fetch member stats
      .addCase(fetchMemberStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchMemberStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch member stats';
      });
  }
});

export const { clearMember, clearError, setCurrentPage } = memberSlice.actions;
export default memberSlice.reducer;