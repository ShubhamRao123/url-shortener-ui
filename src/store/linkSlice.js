// src/store/linkSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchShortLinksByRemarks } from "../services/linkService";

// Async thunk to fetch filtered links
export const fetchLinksByRemarks = createAsyncThunk(
  "links/fetchByRemarks",
  async (remarks, { rejectWithValue }) => {
    try {
      const response = await fetchShortLinksByRemarks(remarks);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const linkSlice = createSlice({
  name: "links",
  initialState: {
    searchRemarks: "", // Stores the search input
    filteredLinks: [], // Stores the filtered links
    loading: false,
    error: null,
  },
  reducers: {
    setSearchRemarks: (state, action) => {
      state.searchRemarks = action.payload;
    },
    resetFilteredLinks: (state) => {
      state.filteredLinks = []; // Reset filteredLinks to an empty array
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLinksByRemarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLinksByRemarks.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredLinks = action.payload;
      })
      .addCase(fetchLinksByRemarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchRemarks, resetFilteredLinks } = linkSlice.actions;
export default linkSlice.reducer;
