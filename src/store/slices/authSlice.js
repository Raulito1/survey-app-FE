import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// jwt decode is a simple library that decodes jwt tokens
import  { jwtDecode }  from 'jwt-decode';

// import the logError action creator from the errorSlice
import { logError } from './errorSlice';

export const getUserRoles = createAsyncThunk(
    'auth/getUserRoles',
    async (getAccessTokenSilently, { dispatch, rejectWithValue }) => {
        try {
            const token = await getAccessTokenSilently();
            const decodedToken = jwtDecode(token);
            return decodedToken['https://my-survey-app.com/roles'] || [];
        } catch (error) {
            dispatch(logError(error.message));
            console.error('Error fetching user roles:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userId: null,
        roles: []
    },
    reducers: {
        login: (state, action) => {
            state.userId = action.payload;
        },
        logout: (state) => {
            state.userId = null;
            state.roles = [];
        },
        setUserRoles: (state, action) => {
            state.roles = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserRoles.fulfilled, (state, action) => {
                state.roles = action.payload;
            })
    },
});

export const { login, logout, setUserRoles } = authSlice.actions;

export default authSlice.reducer;
