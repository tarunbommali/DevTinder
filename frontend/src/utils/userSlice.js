import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isAuthChecked: false,
  },
  reducers: {
    addUser: (state, action) => {
      const userData = action.payload?.user || action.payload?.data || action.payload;
      return { user: userData, isAuthChecked: true };
    },
    removeUser: () => {
      return { user: null, isAuthChecked: true };
    },
    setAuthChecked: (state, action) => {
      return { ...state, isAuthChecked: action.payload };
    },
  },
});

export const { addUser, removeUser, setAuthChecked } = userSlice.actions;

export default userSlice.reducer;
