import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import activityLogService from '../../services/activityLogService';

// Async Thunks
export const getAllActivityLogs = createAsyncThunk(
  'activityLog/getAll',
  async (_, thunkAPI) => {
    try {
      return await activityLogService.getAllActivityLogs();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createActivityLog = createAsyncThunk(
  'activityLog/create',
  async (activityLogData, thunkAPI) => {
    try {
      return await activityLogService.createActivityLog(activityLogData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getActivityLogById = createAsyncThunk(
  'activityLog/getById',
  async (id, thunkAPI) => {
    try {
      return await activityLogService.getActivityLogById(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


const initialState = {
  data: [],
  loading: false,
  error: null,
};

const activityLogSlice = createSlice({
  name: 'activityLog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllActivityLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createActivityLog.pending, (state) => {
        state.loading = true;
      })
      .addCase(createActivityLog.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createActivityLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getActivityLogById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getActivityLogById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [action.payload];
      })
      .addCase(getActivityLogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default activityLogSlice.reducer;