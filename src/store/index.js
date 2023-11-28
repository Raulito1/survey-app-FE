import { configureStore } from '@reduxjs/toolkit';

// import reucers
import surveyReducer from './slices/surveySlice';
import errorReducer from './slices/errorSlice'

export const store = configureStore({
    reducer: {
        survey: surveyReducer,
        error: errorReducer,
    },
});