import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connections",
  initialState: [],
  reducers: {
    addConnections: (state, action) => {
      // Avoid unnecessary re-render by checking if data has actually changed
      const newData = action.payload;

      if (
        Array.isArray(newData) &&
        newData.length === state.length &&
        state.every((conn, idx) => conn._id === newData[idx]?._id)
      ) {
        return state; // return same reference
      }

      return newData;
    },
    removeConnections: () => [],
    removeConnectionById: (state, action) => {
      return state.filter((conn) => conn._id !== action.payload);
    },
  },
});

export const { addConnections, removeConnections, removeConnectionById } = connectionSlice.actions;
export default connectionSlice.reducer;
