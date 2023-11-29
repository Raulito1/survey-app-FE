import React, { useEffect } from 'react';

// React Router
import { useParams } from 'react-router-dom';

// Services
import { surveyService } from '../services/surveyService';

// Components
import CenteredSpinner from './layout/CenteredSpinner';
import SurveyForm from './SurveyForm';

// Redux Hooks
import { useSelector, useDispatch } from 'react-redux';

// Redux Actions
import { setSurvey } from '../store/slices/surveySlice';

const SurveyDetail = () => {
    const { surveyId } = useParams();
    const dispatch = useDispatch();
    const survey = useSelector(state => state.survey.survey);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const data = await surveyService.getSurveyById(surveyId);
                dispatch(setSurvey(data));
            } catch (error) {
                console.error('Error fetching survey:', error);
                // Handle error
            }
        };

        fetchSurvey();
    }, [surveyId, dispatch]);

    if (!survey) {
        return <div><CenteredSpinner /></div>;
    }

    return (
        <div>
            <SurveyForm />
        </div>
    );
};

export default SurveyDetail;
