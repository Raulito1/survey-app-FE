import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { surveyService } from '../../services/surveyService';

// Async thunk for storing survey responses
export const storeResponse = createAsyncThunk(
    'survey/storeResponse',
    async ({ response }, { rejectWithValue }) => {
        try {
            const res = await surveyService.storeResponse(response);
            console.log('Response stored:', res);
            return res.data;
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

// Async thunk for fetching all the surveys
export const fetchAllSurveys = createAsyncThunk(
    'survey/fetchAllSurveys',
    async (_, { rejectWithValue }) => {
        try {
            const response = await surveyService.getAllSurveys();
            // Assuming response is the array of surveys
            return response; // Directly return the response as it should be the surveys array
        }
        catch (error) {
            console.error('Error fetching surveys:', error);
            return rejectWithValue(error.response?.data || 'An unknown error occurred');
        }
    }
);

export const surveySlice = createSlice({
    name: 'survey',
    initialState: {
        questions: [],
        responses: [],
        surveys: [],
        answers: {},
        currentSurvey: null, // Holds the current active survey
        submittedSurveys: {}, // Object to track if a survey has been submitted
        submission: false,
        loading: false,
        error: null,
        surveyId: null,
    },
    reducers: {
        setAnswers: (state, action) => {
            const { questionId, answer } = action.payload;
            // Check if the answer is an array (for multi-select)
            if (Array.isArray(answer)) {
                // Ensure that the answer for the questionId is an array
                if (!Array.isArray(state.answers[questionId])) {
                    state.answers[questionId] = [];
                }

                // Update the array with the new set of selected values
                state.answers[questionId] = answer;
            } else {
                // For other question types, store the single answer
                state.answers[questionId] = answer;
            }
        },
        setSurveyId: (state, action) => {
            state.surveyId = action.payload;
        },
        setSurvey: (state, action) => {
            state.survey = action.payload;
        },
        markSurveyAsSubmitted: (state, action) => {
            const surveyId = action.payload;
            console.log('Marking survey as submitted:', action.payload);
            const survey = state.surveys.find(s => s.id === surveyId);
            console.log('Marking survey as submitted:', surveyId);
            if (survey) {
                survey.submitted = true; // Add the 'submitted' property
            }
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
        [storeResponse.fulfilled]: (state, action) => {
            state.responses = action.payload;
            state.surveySubmissions[state.surveyId] = true;
        },
        [storeResponse.rejected]: (state, action) => {
            state.error = action.payload || 'Could not store response';
        },
        [fetchAllSurveys.fulfilled]: (state, action) => {
            state.surveys = action.payload;
            const surveyId = action.meta.arg.surveyId; // Get the surveyId from the action metadata
            const survey = state.surveys.find(s => s.id === surveyId);
            if (survey) {
                survey.submitted = true; // Mark the survey as submitted
            }        },
        [fetchAllSurveys.rejected]: (state, action) => {
            state.error = action.payload || 'Could not fetch surveys';
        }
    },
});

export const { setAnswers, setSurveyId, setSurvey, markSurveyAsSubmitted } = surveySlice.actions;

export default surveySlice.reducer;
