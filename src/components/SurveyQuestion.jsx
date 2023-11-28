import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SurveyQuestion from './SurveyQuestion';
import { fetchSurveyQuestions } from '../store/slices/surveySlice'; // This action needs to be implemented in your surveySlice

const SurveyQuestionsContainer = () => {
    const dispatch = useDispatch();
    // Assume that the state has a survey object with a questions array
    const questions = useSelector(state => state.survey.questions);

    useEffect(() => {
        // Dispatch an action to fetch questions from the database
        dispatch(fetchSurveyQuestions());
    }, [dispatch]);

    console.log("Questions1:", questions); // Debugging log

    return (
        <div>
            {questions.slice(0, 10).map((question, index) => (
                <SurveyQuestion
                    key={question.id}
                    question={question.text}
                    answerOptions={question.answerOptions}
                    type={question.type}
                />
            ))}
        </div>
    );
};

export default SurveyQuestionsContainer;
