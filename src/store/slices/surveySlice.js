import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { surveyService } from '../../services/surveyService';

// Async thunk for storing survey responses
export const storeResponse = createAsyncThunk(
    'survey/storeResponse',
    async ({ surveyId, responseDto }, { rejectWithValue }) => {
        try {
            const response = await surveyService.storeResponse(surveyId, responseDto);
            console.log('Response stored:', response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for fetching survey questions
export const fetchSurveyQuestions = createAsyncThunk(
    'survey/fetchSurveyQuestions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await surveyService.getAllSurveys(); 
            // Assuming the response contains an array of survey questions
            console.log('Questions received:', response.data.questions);
            return response.data.questions; 
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const surveySlice = createSlice({
    name: 'survey',
    initialState: {
        questions: [],
        answers: {},
        loading: false,
        error: null
    },
    reducers: {
        setAnswers: (state, action) => {
            const { questionId, answer } = action.payload;
            state.answers[questionId] = answer;
        },
    },
    extraReducers: {
        // Handle fetchSurveyQuestions
        [fetchSurveyQuestions.pending]: (state) => {
            state.loading = true;
        },
        [fetchSurveyQuestions.fulfilled]: (state, action) => {
            state.questions = action.payload;
            state.loading = false;
        },
        [fetchSurveyQuestions.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Could not fetch questions';
        },
        // Handle storeResponse
        [storeResponse.fulfilled]: (state) => {
            // You could clear the answers here if you want to reset the form, or handle success in other ways
            state.answers = {};
        },
        [storeResponse.rejected]: (state, action) => {
            // Handle error, possibly by setting an error state variable
            state.error = action.payload || 'Could not store response';
        },
    },
});

export const { setAnswers } = surveySlice.actions;

export default surveySlice.reducer;
