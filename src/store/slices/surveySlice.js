import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Import the surveyService from the services folder
import { surveyService } from '../../services/surveyService';

// Import the logError action creator from the errorSlice
import { logError } from './errorSlice';

// Async thunk for storing survey responses
export const storeResponse = createAsyncThunk(
    'survey/storeResponse',
    async ({ userId, surveyId, response }, { dispatch, rejectWithValue }) => {
        try {
            const data = await surveyService.storeResponse(userId, surveyId, response);
            return data;
        } catch (error) {
            dispatch(logError(error.message));
            console.error('Error storing response:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for fetching survey questions
export const fetchSurveyQuestions = createAsyncThunk(
    'survey/fetchSurveyQuestions',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const response = await surveyService.fetchAllSurveys();
            const surveys = response;

            const currentSurveyId = getState().survey.surveyId;
            if (!currentSurveyId && surveys.length > 0) {
                dispatch(setSurveyId(surveys[0].id));
            }

            const allQuestions = surveys.flatMap(survey => survey.questions);
            return allQuestions;
        } catch (error) {
            dispatch(logError(error.message));
            console.error('Error fetching surveys:', error);
            return rejectWithValue(error.response?.data || 'An unknown error occurred');
        }
    }
);

// Async thunk for fetching all the surveys
export const fetchAllSurveys = createAsyncThunk(
    'survey/fetchAllSurveys',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await surveyService.fetchAllSurveys();
            return response; 
        }
        catch (error) {
            dispatch(logError(error.message));
            console.error('Error fetching surveys:', error);
            return rejectWithValue(error.response?.data || 'An unknown error occurred');
        }
    }
);

// Async thunk for creating a new survey
export const createSurvey = createAsyncThunk(
    'survey/createSurvey',
    async (surveyData, { rejectWithValue, dispatch }) => {
        try {
            const data = await surveyService.createSurvey(surveyData);
            dispatch(fetchAllSurveys());
            return data;
        } catch (error) {
            dispatch(logError(error.message));
            console.error('Error creating survey:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for deleting a survey
export const deleteSurvey = createAsyncThunk(
    'survey/deleteSurvey',
    async (surveyId, { dispatch, rejectWithValue }) => {
        try {
            await surveyService.deleteSurvey(surveyId);
            return surveyId;
        } catch (error) {
            dispatch(logError(error.message));
            console.error('Error deleting survey:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for fetching a survey by ID
export const fetchSurveyById = createAsyncThunk(
    'survey/fetchSurveyById',
    async (surveyId, { dispatch, rejectWithValue }) => {
        try {
            const response = await surveyService.fetchSurveyById(surveyId);
            return response;
        } catch (error) {
            dispatch(logError(error.message));
            console.error('Error fetching survey by ID:', error);
            return rejectWithValue(error.response?.data || 'An unknown error occurred');
        }
    }
);

// Async thunk for refreshing a survey
export const refreshSurvey = createAsyncThunk(
    'survey/refreshSurvey',
    async (surveyId, { dispatch, rejectWithValue }) => {
        try {
            const response = await surveyService.refreshSurvey(surveyId);
            return response;
        } catch (error) {
            dispatch(logError(error.message));
            console.error('Error refreshing survey:', error);
            return rejectWithValue(error.message);
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
        currentSurvey: null, 
        submittedSurveys: {}, 
        submissionSuccess: false,
        submission: false,
        loading: false,
        surveyId: null,
        editingSurveyId: null,
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
            state.surveyId = action.payload.id;
            state.questions = action.payload.questions;
        },
        markSurveyAsSubmitted: (state, action) => {
            const surveyId = action.payload;
            state.submittedSurveys[surveyId] = true;
        },
        resetSubmissionState: (state) => {
            state.submissionSuccess = false;
        },
        resetSubmittedSurveys: (state, action) => {
            const surveyId = action.payload;

            if (state.submittedSurveys[surveyId]) {
                delete state.submittedSurveys[surveyId];
            }
        },
        setEditingSurveyId: (state, action) => {
            state.editingSurveyId = action.payload;
        },
        toggleSurveySubmit: (state, action) => {
            const surveyId = action.payload;
            state.submittedSurveys[surveyId] = !state.submittedSurveys[surveyId];
        },
    },
    extraReducers: (builders) => {
        builders
            .addCase(fetchSurveyQuestions.pending, (state) => { 
                state.loading = true;
            })
            .addCase(fetchSurveyQuestions.fulfilled, (state, action) => {
                state.questions = action.payload;
                state.loading = false;
            })
            .addCase(storeResponse.pending, (state) => {
                state.loading = true;
            })
            .addCase(storeResponse.fulfilled, (state, action) => {
                const surveyId = action.payload?.surveyId;

                if (surveyId) {
                    state.responses = [...state.responses, action.payload];
                    state.submittedSurveys[surveyId] = true;
                    state.submissionSuccess = true;
                } else {
                    console.error('No surveyId provided in response');
                }
                state.loading = false;
            })
            .addCase(fetchAllSurveys.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllSurveys.fulfilled, (state, action) => {
                state.loading = false;
                state.surveys = action.payload;

                if (!state.surveyId && state.surveys.length > 0) {
                    state.surveyId = state.surveys[0].id;
                }

                state.surveys.forEach((survey) => {
                    if (state.submittedSurveys[survey.id]) {
                        console.log(`Survey with ID ${survey.id} has been submitted.`);
                    } else {
                        console.log(`Survey with ID ${survey.id} has not been submitted.`);
                    }
                });
            })
            .addCase(createSurvey.fulfilled, (state, action) => {
                state.surveys.push(action.payload);
                state.loading = false;
            })
            .addCase(createSurvey.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteSurvey.fulfilled, (state, action) => {
                state.surveys = state.surveys.filter(survey => survey.id !== action.payload);
                state.loading = false;
            })
            .addCase(fetchSurveyById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSurveyById.fulfilled, (state, action) => {
                state.currentSurvey = action.payload;
                state.loading = false;
            })
    },
});

export const { setAnswers, setSurveyId, setSurvey, markSurveyAsSubmitted, resetSubmissionState, resetSubmittedSurveys, setEditingSurveyId, toggleSurveySubmit } = surveySlice.actions;

export default surveySlice.reducer;
