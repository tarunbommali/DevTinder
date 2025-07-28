import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Assuming userSlice.js is in the same directory
import feedReducer from './feedSlice'; // Assuming feedSlice.js is in the same directory

const appStore = configureStore({
    reducer : {
        user: userReducer,
        feed: feedReducer,
    }
})


export default appStore;