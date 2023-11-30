import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { surveyService } from '../../services/surveyService';

// Async thunk for storing survey responses
export const storeResponse = createAsyncThunk(
    'survey/storeResponse',
    async ({ userId, surveyId, response }, { rejectWithValue }) => {
    try {
        const res = await fetch('http://localhost:3001/answers', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, surveyId, responses: response.responses }),
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await res.json();
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
            return response; 
        }
        catch (error) {
            console.error('Error fetching surveys:', error);
            return rejectWithValue(error.response?.data || 'An unknown error occurred');
        }
    }
);

export const selectAreAllSurveysSubmitted = (state) => {
    return state.survey.surveys.every((survey) => state.survey.submittedSurveys[survey.id]);
};

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
            console.log('Setting survey:', action.payload);
            state.survey = action.payload;
            state.surveyId = action.payload.id;
            state.questions = action.payload.questions;
        },
        markSurveyAsSubmitted: (state, action) => {
            const surveyId = action.payload;
            console.log('Marking survey as submitted:', surveyId);
            state.submittedSurveys[surveyId] = true; // Properly update the submittedSurveys object
        },
        resetSubmissionState: (state) => {
            state.submissionSuccess = false;
            // Reset any other related state properties as needed
        },
        resetSubmittedSurveys: (state) => {
            state.submittedSurveys = {};
        }
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
                    state.submittedSurveys[surveyId] = true; // Set the survey as submitted
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
                console.log('Surveys fetched:', action.payload); // Assuming action.payload is the array of surveys
                state.loading = false;
                state.surveys = action.payload;
                if (!state.surveyId && state.surveys.length > 0) {
                    state.surveyId = state.surveys[0].id; // Only set this if surveyId isn't already set
                }

                state.surveys.forEach((survey) => {
                    // Check the submission status using the submittedSurveys state
                    if (state.submittedSurveys[survey.id]) {
                        console.log(`Survey with ID ${survey.id} has been submitted.`);
                    } else {
                        console.log(`Survey with ID ${survey.id} has not been submitted.`);
                    }
                });
            })
            .addCase(fetchAllSurveys.rejected, (state, action) => {
                state.error = action.payload || 'Could not fetch surveys';
            });
    },
});

export const { setAnswers, setSurveyId, setSurvey, markSurveyAsSubmitted, resetSubmissionState, resetSubmittedSurveys } = surveySlice.actions;

export default surveySlice.reducer;
