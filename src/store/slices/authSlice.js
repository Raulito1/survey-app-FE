import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userId: null,
    },
    reducers: {
        login: (state, action) => {
            state.userId = action.payload; 
        },
        logout: (state) => {

            console.log('Logging out');

         // Clear the userId on logout
            state.userId = null;
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
