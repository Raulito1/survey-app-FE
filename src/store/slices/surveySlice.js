import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// service that makes the API call
import { surveyService } from '../../services/surveyService';

export const storeResponse = createAsyncThunk(
    'survey/storeResponse',
    async (surveyId, responseDto) => {
        const response = await surveyService.storeResponse(surveyId, responseDto);
        return response.data;
    }
);

export const surveySlice = createSlice({
    name: 'survey',
    initialState: {
        questions: [],
        answers: {}
    },
    reducers: {
        setQuestions: (state, action) => {
            state.questions = action.payload;
        },
        setAnswers: (state, action) => {
            const { questionId, answer } = action.payload;
            state.answers[questionId] = answer;
        },
    },
    extraReducers: {
        [storeResponse.fulfilled]: (state, action) => {
            console.log('storeResponse.fulfilled', action);
        },
        [storeResponse.rejected]: (state, action) => {
            console.log('storeResponse.rejected', action);
        },
    },
});

export const { setQuestions, setAnswers } = surveySlice.actions;

export default surveySlice.reducer;