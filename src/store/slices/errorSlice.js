import { createSlice } from '@reduxjs/toolkit';

export const errorSlice = createSlice({
    name: 'error',
    initialState: {
        error: null,
    },
    reducers: {
        logError: (state, action) => {
            state.error = action.payload;
        },
        clearError: state => {
            state.error = null;
        },
    },
});

export const { logError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
