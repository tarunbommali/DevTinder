import { createSelector } from "@reduxjs/toolkit";

const selectUserState = (state) => state.user;

export const selectUser = createSelector(
  [selectUserState],
  (userState) => userState.user
);
