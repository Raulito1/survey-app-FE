import React, { useEffect } from 'react';

// React Router
import { useParams } from 'react-router-dom';

// Services
import { surveyService } from '../services/surveyService';

// Custom Components
import CenteredSpinner from './layout/CenteredSpinner';
import SurveyForm from './SurveyForm';
import Title from './layout/Title';
import NotificationToast from './layout/NotificationToast';

// Redux Hooks
import { useSelector, useDispatch } from 'react-redux';

// Redux Actions
import { setSurvey, resetSubmissionState } from '../store/slices/surveySlice';

const SurveyDetail = () => {
    const { surveyId } = useParams();
    const dispatch = useDispatch();
    const survey = useSelector(state => state.survey.survey);
    const surveyQuestions = useSelector(state => state.survey.questions);
    const { showToast } = NotificationToast();

    useEffect(() => {
        dispatch(resetSubmissionState());

        const fetchSurvey = async () => {
            try {
                const data = await surveyService.fetchSurveyById(surveyId);
                dispatch(setSurvey(data));
            } catch (error) {
                console.error('Error fetching survey: detail', error);
                showToast({
                    title: 'Failed to fetch survey!',
                    description: error.message,
                    status: 'error'
                });
            }
        };
        fetchSurvey();
    }, [surveyId, dispatch]);

    if (!survey) {
        return <div><CenteredSpinner /></div>;
    }

    console.log('Survey Detail: ', surveyQuestions);

    return (
        <div>
            <Title title={survey.title} />
            <SurveyForm questions={surveyQuestions}/>
        </div>
    );
};

export default SurveyDetail;
