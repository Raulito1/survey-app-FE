import { configureStore } from '@reduxjs/toolkit';

// import reucers
import surveyReducer from './slices/surveySlice';
import errorReducer from './slices/errorSlice'
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        survey: surveyReducer,
        error: errorReducer,
        auth: authReducer,
    },
});