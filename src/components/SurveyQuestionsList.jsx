// Redux Hooks
import { useSelector } from 'react-redux';

// Custom Components
import SurveyQuestion from './SurveyQuestion';

const SurveyQuestionsList = () => {
    const questions = useSelector(state => state.survey.questions);

    return (
        <div>
            {questions.slice(0, 10).map(question => (
                <SurveyQuestion
                    key={question.id}
                    survey={question}
                />
            ))}
        </div>
    );
};

export default SurveyQuestionsList;
