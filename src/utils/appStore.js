import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Assuming userSlice.js is in the same directory


const appStore = configureStore({
    reducer : {
        user: userReducer,
    }
})


export default appStore;