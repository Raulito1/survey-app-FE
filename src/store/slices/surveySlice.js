import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { surveyService } from '../../services/surveyService';

// Async thunk for storing survey responses
export const storeResponse = createAsyncThunk(
    'survey/storeResponse',
    async ({ userId, surveyId, response }, { rejectWithValue }) => {
        try {
            const data = await surveyService.storeResponse(userId, surveyId, response);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for fetching survey questions
export const fetchSurveyQuestions = createAsyncThunk(
    'survey/fetchSurveyQuestions',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const response = await surveyService.getAllSurveys();
            const surveys = response;

            const currentSurveyId = getState().survey.surveyId;
            if (!currentSurveyId && surveys.length > 0) {
                dispatch(setSurveyId(surveys[0].id));
            }

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
            return response; 
        }
        catch (error) {
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
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for deleting a survey
export const deleteSurvey = createAsyncThunk(
    'survey/deleteSurvey',
    async (surveyId, { rejectWithValue }) => {
        try {
            await surveyService.deleteSurvey(surveyId);
            return surveyId;  // Returning the deleted survey's ID
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for fetching a survey by ID
export const fetchSurveyById = createAsyncThunk(
    'survey/fetchSurveyById',
    async (surveyId, { rejectWithValue }) => {
        try {
            const response = await surveyService.fetchSurveyById(surveyId);
            return response;
        } catch (error) {
            console.error('Error fetching survey by ID:', error);
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
        currentSurvey: null, 
        submittedSurveys: {}, 
        submissionSuccess: false,
        submission: false,
        loading: false,
        error: null,
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
            .addCase(fetchSurveyQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Could not fetch questions';
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
            .addCase(storeResponse.rejected, (state, action) => {
                state.error = action.payload || 'Could not store response';
            })
            .addCase(fetchAllSurveys.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllSurveys.fulfilled, (state, action) => {
                console.log('Surveys fetched:', action.payload);
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
            .addCase(fetchAllSurveys.rejected, (state, action) => {
                state.error = action.payload || 'Could not fetch surveys';
            })
            .addCase(createSurvey.fulfilled, (state, action) => {
                state.surveys.push(action.payload);
                state.loading = false;
            })
            .addCase(createSurvey.pending, (state) => {
                state.loading = true;
            })
            .addCase(createSurvey.rejected, (state, action) => {
                state.error = action.payload || 'Could not create survey';
                state.loading = false;
            })
            .addCase(deleteSurvey.fulfilled, (state, action) => {
                state.surveys = state.surveys.filter(survey => survey.id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteSurvey.rejected, (state, action) => {
                state.error = action.payload || 'Could not delete survey';
                state.loading = false;
            })
            .addCase(fetchSurveyById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSurveyById.fulfilled, (state, action) => {
                state.currentSurvey = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchSurveyById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch survey';
            });
    },
});

export const { setAnswers, setSurveyId, setSurvey, markSurveyAsSubmitted, resetSubmissionState, resetSubmittedSurveys, setEditingSurveyId } = surveySlice.actions;

export default surveySlice.reducer;
