import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import returnService from '../../services/returnService';

// Async Thunks
export const getAllReturns = createAsyncThunk(
  'return/getAll',
  async (_, thunkAPI) => {
    try {
      return await returnService.getAllReturns();
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

export const createSaleReturn = createAsyncThunk(
  'return/createSaleReturn',
  async (returnData, thunkAPI) => {
    try {
      return await returnService.createSaleReturn(returnData);
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

export const createPurchaseReturn = createAsyncThunk(
  'return/createPurchaseReturn',
  async (returnData, thunkAPI) => {
    try {
      return await returnService.createPurchaseReturn(returnData);
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

export const getReturnById = createAsyncThunk(
  'return/getById',
  async (id, thunkAPI) => {
    try {
      return await returnService.getReturnById(id);
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

export const updateReturnById = createAsyncThunk(
  'return/updateById',
  async ({ id, returnData }, thunkAPI) => {
    try {
      return await returnService.updateReturnById(id, returnData);
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

export const deleteReturnById = createAsyncThunk(
  'return/deleteById',
  async (id, thunkAPI) => {
    try {
      return await returnService.deleteReturnById(id);
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

const returnSlice = createSlice({
  name: 'return',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllReturns.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllReturns.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllReturns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSaleReturn.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSaleReturn.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createSaleReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPurchaseReturn.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPurchaseReturn.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createPurchaseReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getReturnById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReturnById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [action.payload];
      })
      .addCase(getReturnById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateReturnById.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReturnById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateReturnById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteReturnById.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReturnById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((item) => item._id !== action.payload._id);
      })
      .addCase(deleteReturnById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default returnSlice.reducer;