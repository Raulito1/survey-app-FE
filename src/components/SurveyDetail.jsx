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
import { setSurvey, resetSubmissionState, selectSurveyById } from '../store/slices/surveySlice';

const SurveyDetail = () => {
    const { surveyId } = useParams();
    const dispatch = useDispatch();
    const survey = useSelector((state) => selectSurveyById(state, surveyId));
    
    const { showToast } = NotificationToast();

    console.log('Survey Detail', survey);

    useEffect(() => {
        dispatch(resetSubmissionState());

        const fetchSurvey = async () => {
            try {
                const data = await surveyService.fetchSurveyById(surveyId);
                console.log('Survey Detail', data);
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
    }, [surveyId, dispatch, showToast]);

    if (!survey) {
        return <div><CenteredSpinner /></div>;
    }

    return (
        <div>
            <Title title={survey.title} />
            <SurveyForm />
        </div>
    );
};

export default SurveyDetail;
