import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { surveyService } from '../../services/surveyService';

// Async thunk for storing survey responses
export const storeResponse = createAsyncThunk(
    'survey/storeResponse',
    async ({ userId, surveyId, responseDto }, { rejectWithValue }) => {
        try {
            const response = await surveyService.storeResponse(userId, surveyId, responseDto);
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
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const response = await surveyService.getAllSurveys();
            const surveys = response; // Assuming this is the array of surveys

            // Set default surveyId if it's not already set
            const currentSurveyId = getState().survey.surveyId;
            if (!currentSurveyId && surveys.length > 0) {
                dispatch(setSurveyId(surveys[0].id));
            }

            // Extract questions and continue as before
            const allQuestions = surveys.flatMap(survey => survey.questions);
            return allQuestions;
        } catch (error) {
            console.error('Error fetching surveys:', error);
            return rejectWithValue(error.response?.data || 'An unknown error occurred');
        }
    }
);


export const surveySlice = createSlice({
    name: 'survey',
    initialState: {
        questions: [],
        answers: {},
        loading: false,
        error: null,
        userId: null,
        surveyId: null,
    },
    reducers: {
        setAnswers: (state, action) => {
            const { questionId, answer } = action.payload;
            console.log('Setting answer:', { questionId, answer });
            state.answers[questionId] = answer;
        },
        setUserId: (state, action) => {
            console.log('Setting userId:', action.payload);
            state.userId = action.payload;
        },
        setSurveyId: (state, action) => {
            console.log('Setting surveyId:', action.payload);
            state.surveyId = action.payload;
        }
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
export const { setUserId } = surveySlice.actions;
export const { setSurveyId } = surveySlice.actions;

export default surveySlice.reducer;
