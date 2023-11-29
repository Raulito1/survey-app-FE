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
            state.survey = action.payload;
            state.surveyId = action.payload.id;
        },
        markSurveyAsSubmitted: (state, action) => {
            const surveyId = action.payload;
            console.log('Marking survey as submitted:', surveyId);
            state.surveys = state.surveys.map(survey => 
                survey.id === surveyId ? { ...survey, submitted: true } : survey
            );
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
            const surveyId = action.payload?.surveyId;
            
            if (surveyId) {
                state.responses = [...state.responses, action.payload];
                state.submittedSurveys[surveyId] = true; // Set the survey as submitted
                state.submissionSuccess = true;
            } else {
                console.error('No surveyId provided in response');
            }
        },
        [storeResponse.rejected]: (state, action) => {
            state.error = action.payload || 'Could not store response';
        },
        [fetchAllSurveys.fulfilled]: (state, action) => {
            console.log('Surveys fetched:', action);
            state.surveys = action.payload;
            if (!state.surveyId && state.surveys.length > 0) {
                state.surveyId = state.surveys[0].id; // Only set this if surveyId isn't already set
            }
            state.surveys.forEach((survey) => {
                // get each survey id and set it the surveyId state
                state.surveyId = survey.id;
               // Check if the survey has a 'submitted' property and if it's true
                if (survey.hasOwnProperty('submitted') && survey.submitted === true) {
                    console.log(`Survey with ID ${survey.id} has been submitted.`);
                    // Here you can do additional processing if needed
                } else {
                    console.log(`Survey with ID ${survey.id} has not been submitted.`);
                    // Any other processing for surveys that have not been submitted
                }
            });  
        },
        [fetchAllSurveys.rejected]: (state, action) => {
            state.error = action.payload || 'Could not fetch surveys';
        }
    },
});

export const { setAnswers, setSurveyId, setSurvey, markSurveyAsSubmitted } = surveySlice.actions;

export default surveySlice.reducer;
