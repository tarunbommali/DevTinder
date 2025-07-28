import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connection", 
  initialState: [],
  reducers: {
    addConnections: (state, action) => action.payload,
    removeConnections: () => [],
  },
});

export const { addConnections, removeConnections } = connectionSlice.actions;
export default connectionSlice.reducer;
