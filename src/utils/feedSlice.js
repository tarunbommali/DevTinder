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
    removeUserFromFeed: (state, action) => {
      state.data = state.data.filter((user) => user._id !== action.payload);
    },
    removeFeed: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { addFeed, removeUserFromFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
