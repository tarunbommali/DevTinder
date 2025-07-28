import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice'; 
import feedReducer from './feedSlice'; 
import requestReducer from './requestSlice';
import connectionReducer from './connectionSlice';

const appStore = configureStore({
    reducer : {
        user: userReducer,
        feed: feedReducer,
        requests: requestReducer,
        connections: connectionReducer,
    }
})


export default appStore;