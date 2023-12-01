// Custom Components
import SurveyQuestion from './SurveyQuestion';

// Redux Hooks
import { useSelector } from 'react-redux';

// Redux Actions
const SurveyQuestionsList = ({ surveyId }) => {
    const questions = useSelector(state => state.survey.questionsBySurveyId[surveyId] || []);
    
    return (
        <div>
            {questions.slice(0, 10).map((question, index)=> (
                <SurveyQuestion
                    key={index}
                    survey={question}
                />
            ))}
        </div>
    );
};

export default SurveyQuestionsList;
