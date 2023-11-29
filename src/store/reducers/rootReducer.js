import { combineReducers } from '@reduxjs/toolkit';
import surveyReducer from '../slices/surveySlice';
import errorReducer from '../slices/errorSlice';
import authReducer from '../slices/authSlice';

const rootReducer = combineReducers({
    survey: surveyReducer,
    error: errorReducer,
    auth: authReducer,
});

export default rootReducer;
