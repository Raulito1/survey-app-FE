// src/components/SurveyForm.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SurveyQuestion from './SurveyQuestion';


import { setAnswers, storeResponse } from '../store/slices/surveySlice';
import setError from '../store/slices/errorSlice';

const SurveyForm = () => {
    const dispatch = useDispatch();
    const questions = useSelector(state => state.survey.questions);
    const answers = useSelector(state => state.survey.answers);

    const handleAnswerChange = (questionId, event) => {
        const { value, type, checked } = event.target;

        if (type === "checkbox") {
            const updatedOptions = checked
                ? [...(answers[questionId]?.answerOptions || []), value]
                : (answers[questionId]?.answerOptions || []).filter(opt => opt !== value);

            dispatch(setAnswers({ questionId, answer: { answerOptions: updatedOptions } }));
        } else {
            dispatch(setAnswers({ questionId, answer: { answer: value } }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(answers);
        try {
            // Submit the survey response
            const responseDto = {};
            await dispatch(storeResponse({surveyId: '', responseDto})).unwrap();
            // Handle successful submission

        } catch (error) {
            // Handle error
            dispatch(setError(error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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
