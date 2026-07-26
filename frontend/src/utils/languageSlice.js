import { createSlice } from "@reduxjs/toolkit";

const getInitialLang = () => {
  if (typeof window !== "undefined") {
    const savedLang = localStorage.getItem("vybe_lang");
    if (savedLang) return savedLang;
  }
  return "en";
};

const languageSlice = createSlice({
  name: "language",
  initialState: {
    lang: getInitialLang(),
    isModalOpen: false,
  },
  reducers: {
    setLanguage: (state, action) => {
      state.lang = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("vybe_lang", action.payload);
      }
    },
    openLangModal: (state) => {
      state.isModalOpen = true;
    },
    closeLangModal: (state) => {
      state.isModalOpen = false;
    },
    toggleLangModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
  },
});

export const { setLanguage, openLangModal, closeLangModal, toggleLangModal } = languageSlice.actions;
export default languageSlice.reducer;
