import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// jwt decode is a simple library that decodes jwt tokens
import  { jwtDecode }  from 'jwt-decode';

export const getUserRoles = createAsyncThunk(
    'auth/getUserRoles',
    async (getAccessTokenSilently, thunkAPI) => {
        try {
            const token = await getAccessTokenSilently();
            const decodedToken = jwtDecode(token);
            return decodedToken['https://my-survey-app.com/roles'] || [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userId: null,
        roles: [],
        error: null
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
            .addCase(getUserRoles.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(getUserRoles.pending, (state, action) => {
                state.error = null;
            })
    },
});

export const { login, logout, setUserRoles } = authSlice.actions;

export default authSlice.reducer;
