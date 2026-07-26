import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice'; 
import feedReducer from './feedSlice'; 
import requestReducer from './requestSlice';
import connectionReducer from './connectionSlice';
import themeReducer from './themeSlice';
import languageReducer from './languageSlice';

const appStore = configureStore({
    reducer : {
        user: userReducer,
        feed: feedReducer,
        requests: requestReducer,
        connections: connectionReducer,
        theme: themeReducer,
        language: languageReducer,
    }
})


export default appStore;