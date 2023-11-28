// src/store/slices/errorSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const errorSlice = createSlice({
    name: 'error',
    initialState: {
        error: null,
    },
    reducers: {
        logError: (state, action) => {
        // You could further enhance this to push the error into an array if you want to keep a history of errors
            state.error = action.payload;
        },
        clearError: state => {
            state.error = null;
        },
    },
});

export const { logError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
