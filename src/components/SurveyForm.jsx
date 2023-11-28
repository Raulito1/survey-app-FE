import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SurveyQuestion from './SurveyQuestion';

import { setAnswers, storeResponse } from '../store/slices/surveySlice';
import setError from '../store/slices/errorSlice';

const SurveyForm = () => {
    const dispatch = useDispatch();
    const survey = useSelector(state => state.survey);
    const { questions, surveyId, answers } = survey;
    
    console.log("Survey:", survey); // Debugging log
    
    const handleAnswerChange = (questionId, event) => {
        const { value, type, checked } = event.target;

        if (type === "checkbox") {
            const updatedOptions = checked
                ? [...(answers[questionId]?.answerOptions || []), value]
                : answers[questionId]?.answerOptions.filter(opt => opt !== value) || [];

            dispatch(setAnswers({ questionId, answer: { answerOptions: updatedOptions } }));
        } else {
            dispatch(setAnswers({ questionId, answer: value }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Format the answers properly for the API
        const responseDto = {
            responses: Object.entries(answers).map(([questionId, answerData]) => ({
                questionId: parseInt(questionId),
                answer: answerData.answer || null,
                answerOptions: answerData.answerOptions || null,
            }))
        };

        try {
            // Submit the survey response
            await dispatch(storeResponse({ surveyId, responseDto })).unwrap();
            // Handle successful submission here, e.g., show a message or redirect
        } catch (error) {
            // Handle error
            dispatch(setError(error.message));
        }
    };

    console.log("Questions:", questions); // Debugging log


    return (
        <form onSubmit={handleSubmit}>
            <h1>form!</h1>
            {questions.map(question => (
                <SurveyQuestion
                    key={question.id}
                    question={question.text}
                    answerOptions={question.answerOptions}
                    type={question.type}
                    answer={answers[question.id]?.answer || ''}
                    onAnswerChange={(event) => handleAnswerChange(question.id, event)}
                />
            ))}
            <button type="submit">Submit</button>
        </form>
    );
};

export default SurveyForm;
