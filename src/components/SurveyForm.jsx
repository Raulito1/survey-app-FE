import React, { useEffect } from 'react';

// Chakra UI Components
import { Button, Flex } from '@chakra-ui/react';

// React Router
import { useNavigate } from 'react-router-dom';

// Redux
import { useDispatch, useSelector } from 'react-redux';

// Redux Actions
import { submitSurveyResponses } from '../store/slices/surveySlice';

// Custom Components
import CenteredSpinner from './layout/CenteredSpinner';
import NotificationToast from './layout/NotificationToast';
import ErrorBoundary from './ErrorBoundary';
import SurveyQuestionsList from './SurveyQuestionsList';

const SurveyForm = () => {
    const dispatch = useDispatch();
    const survey = useSelector(state => state.survey);
    const { loading, error, submissionSuccess } = survey;
    const navigate = useNavigate();
    const { showToast } = NotificationToast();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Survey Form submit: ', survey);
        // submitSurveyResponses(dispatch, survey);
    };

    useEffect(() => {
        if (submissionSuccess) {
            showToast({
                title: 'Success',
                description: 'Survey submitted successfully!',
                status: 'success'
            });

            setTimeout(() => navigate('/'), 3000);
        }
    }, [submissionSuccess, navigate, showToast]);

    useEffect(() => {
        if (error) {
            showToast({
                title: 'Failed to submit survey!',
                description: error,
                status: 'error'
            });
        }
    }, [error, showToast]);

    return (
        <form onSubmit={handleSubmit} style={{ paddingTop: '20px' }}>
            <Flex direction='column' align='center' justify='center'>
                {loading && <CenteredSpinner />}
                {!loading && !error && (
                    <ErrorBoundary>
                        <SurveyQuestionsList 
                            key={survey.surveyId}
                            questions={survey.questions} 
                            answers={survey.answers} 
                        />
                    </ErrorBoundary>
                )}
                <Button colorScheme='blue' type='submit' mt={4}>Submit</Button>
            </Flex>
        </form>
    );
};

export default SurveyForm;