import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

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

// Async thunk for updating survey details
export const updateSurveyDetails = createAsyncThunk(
    'survey/updateSurveyDetails',
    async (surveyData, { dispatch, getState, rejectWithValue }) => {
        try {
            await surveyService.updateSurvey(surveyData);
            return surveyData;
        } catch (error) {
            dispatch(logError(error.message));
            console.error('Error refreshing survey:', error);
            return rejectWithValue(error.response.data);
        }
    }
);

const QuestionTypes = {
    SINGLE_SELECT: 'single-select',
    MULTI_SELECT: 'multi-select',
    SLIDER: 'slider',
    BOOLEAN: 'boolean',
    TEXT: 'text'
};

export const surveySlice = createSlice({
    name: 'survey',
    initialState: {
        questions: [],
        questionsBySurveyId: {},
        responses: [],
        surveys: [],
        answers: {},
        currentSurvey: null, 
        submittedSurveys: {}, 
        submissionSuccess: false,
        submission: false,
        loading: false,
        surveyId: null,
        surveyTitle: '',
        editingSurveyId: null,
        newSurvey: {
            title: '',
            description: '',
            questions: []
        }
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
            state.currentSurvey = action.payload;
        },
        markSurveyAsSubmitted: (state, action) => {
            const surveyId = action.payload;
            state.submittedSurveys[surveyId] = true;
        },
        resetSurveyState: (state) => {
            state.submissionSuccess = false;
        },
        resetSubmissionState: (state) => {
            state.submissionSuccess = false;
        },
        setEditingSurveyId: (state, action) => {
            state.editingSurveyId = action.payload;
        },
        toggleSurveySubmit: (state, action) => {
            const surveyId = action.payload;
            state.submittedSurveys[surveyId] = !state.submittedSurveys[surveyId];
        },
        updateNewSurveyTitle: (state, action) => {
            state.newSurvey.title = action.payload;
        },
        updateNewSurveyDescription: (state, action) => {
            state.newSurvey.description = action.payload;
        },
        addNewSurveyQuestion: (state) => {
            state.newSurvey.questions.push({ question: '', type: QuestionTypes.SINGLE_SELECT, options: [] });
        },
        updateNewSurveyQuestion: (state, action) => {
            const { index, field, value } = action.payload;
            state.newSurvey.questions[index] = { ...state.newSurvey.questions[index], [field]: value };
        },
        removeNewSurveyQuestion: (state, action) => {
            state.newSurvey.questions.splice(action.payload, 1);
        },
        addOptionToNewSurveyQuestion: (state, action) => {
            const questionIndex = action.payload;
            state.newSurvey.questions[questionIndex].options.push('');
        },
        updateOptionInNewSurveyQuestion: (state, action) => {
            const { questionIndex, optionIndex, value } = action.payload;
            state.newSurvey.questions[questionIndex].options[optionIndex] = value;
        },
        removeOptionFromNewSurveyQuestion: (state, action) => {
            const { questionIndex, optionIndex } = action.payload;
            state.newSurvey.questions[questionIndex].options.splice(optionIndex, 1);
        },
        updateSurveyTitle: (state, action) => {
            if (state.currentSurvey) {
                state.currentSurvey.title = action.payload;
            }
        },
        updateSurveyDescription: (state, action) => {
            if (state.currentSurvey) {
                state.currentSurvey.description = action.payload;
            }
        },
        updateSurveyQuestion: (state, action) => {
            const { index, field, value } = action.payload;
            if (state.currentSurvey && state.currentSurvey.questions[index]) {
                state.currentSurvey.questions[index][field] = value;
            }
        },
        removeSurveyQuestion: (state, action) => {
            const index = action.payload;
            if (state.currentSurvey) {
                state.currentSurvey.questions.splice(index, 1);
            }
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

                state.questionsBySurveyId = {};

                action.payload.forEach((survey) => {
                    state.questionsBySurveyId[survey.id] = survey.questions;
                });

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
                state.loading = false;
                state.currentSurvey = action.payload;
                if (action.payload.questions) {
                    state.questionsBySurveyId[action.payload.id] = action.payload.questions;
                }
                state.loading = false;
            })
            .addCase(refreshSurvey.fulfilled, (state, action) => {
                const surveyIndex = state.surveys.findIndex(survey => survey.id === action.payload.id);
                if (surveyIndex !== -1) {
                    state.surveys[surveyIndex].lastRefreshed = action.payload.lastRefreshed;
                }
            })
            .addCase(updateSurveyDetails.fulfilled, (state, action) => {
                const index = state.surveys.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.surveys[index] = action.payload;
                }
            })
    },
});

export const markSurveyAsUnsubmitted = surveyId => (dispatch, getState) => {
    const { submittedSurveys } = getState().survey;

    console.log('Submitted surveys:', submittedSurveys);
    if (submittedSurveys[surveyId]) {
        dispatch(surveySlice.actions.toggleSurveySubmit(surveyId));
    }
};

export const resetSurveyForm = () => (dispatch) => {
    dispatch(surveySlice.actions.resetSurveyState());
};

export const selectCurrentSurveyQuestions = createSelector(
    state => state.survey.currentSurvey,
    currentSurvey => currentSurvey?.questions || []
);

export const selectSurveyById = createSelector(
    [state => state.survey.surveys, (_, surveyId) => surveyId],
    (surveys, surveyId) => surveys.find(s => s.id.toString() === surveyId)
);

export const selectQuestionsForCurrentSurvey = createSelector(
    [state => state.survey.currentSurveyId, state => state.survey.questionsBySurveyId],
    (currentSurveyId, questionsBySurveyId) => {
        return questionsBySurveyId[currentSurveyId] || [];
    }
);

export const { 
    setAnswers, 
    setSurveyId, 
    setSurvey, 
    markSurveyAsSubmitted,
    resetSubmissionState, 
    setEditingSurveyId, 
    toggleSurveySubmit,
    updateNewSurveyTitle, 
    updateNewSurveyDescription, 
    addNewSurveyQuestion, 
    updateNewSurveyQuestion, 
    removeNewSurveyQuestion,
    addOptionToNewSurveyQuestion, 
    updateOptionInNewSurveyQuestion, 
    removeOptionFromNewSurveyQuestion,
} = surveySlice.actions;

export default surveySlice.reducer;
