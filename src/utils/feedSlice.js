import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    loading: false,
    error: null,
    data: [],
  },
  reducers: {
    addFeed: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    removeFeed: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { addFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
