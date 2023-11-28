import React from 'react';

// Import Custom Component
import QuestionTypeRenderer from './QuestionTypeRenderer';

const SurveyQuestion = ({ question, answerOptions, type }) => {
    return (
        <div>
            <h3>{question}</h3>
            {/* Render different types of questions based on props */}
            <QuestionTypeRenderer question={question} answerOptions={answerOptions} type={type}/>
        </div>
    );
};

export default SurveyQuestion;
