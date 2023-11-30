import React from 'react';
import { useSelector } from 'react-redux';
import SurveyQuestion from './SurveyQuestion';

const SurveyQuestionsList = () => {
    const questions = useSelector(state => state.survey.questions);

    return (
        <div>
            {questions.slice(0, 10).map(question => (
                <SurveyQuestion
                    key={question.id}
                    question={question.content}
                    questionId={question.id}
                    options={question.options}
                    type={question.type}
                />
            ))}
        </div>
    );
};

export default SurveyQuestionsList;
