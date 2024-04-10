import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  priorityReasons: [],
  loading: false,
  error: null
};

// Define the async thunk for fetching priority reasons
export const fetchPriorityReasons = createAsyncThunk(
  "priorityReasons/fetchPriorityReasons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/priority-reasons");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a slice for managing priority reasons
const priorityReasonsSlice = createSlice({
  name: "priorityReasons",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPriorityReasons.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriorityReasons.fulfilled, (state, action) => {
        state.loading = false;
        state.priorityReasons = action.payload;
      })
      .addCase(fetchPriorityReasons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default priorityReasonsSlice.reducer;
