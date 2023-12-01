import React, { useEffect, useState } from 'react';

// Chakra UI Components
import { Button, Flex } from '@chakra-ui/react';

// React Router
import { useNavigate } from 'react-router-dom';

// Redux
import { useDispatch, useSelector } from 'react-redux';

// Redux Actions
import { storeResponse, markSurveyAsSubmitted } from '../store/slices/surveySlice';

// Custom Components
import CenteredSpinner from './layout/CenteredSpinner';
import NotificationToast from './layout/NotificationToast';
import ErrorBoundary from './ErrorBoundary';
import SurveyQuestionsList from './SurveyQuestionsList';

// Custom Hooks
import useErrorAlert from '../hooks/useErrorAlert';

const SurveyForm = () => {
    const dispatch = useDispatch();
    const currentSurvey = useSelector(state => state.survey.currentSurvey);
    const userId = useSelector(state => state.auth.userId); // Make sure this is the correct path to user ID
    const { loading, error, submissionSuccess } = useSelector(state => state.survey);
    const navigate = useNavigate();
    const { showToast } = NotificationToast();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const responsePromises = Object.entries(currentSurvey.answers || {}).map(([questionId, answer]) =>
            dispatch(storeResponse({
                userId: userId,
                surveyId: currentSurvey.id,
                response: { questionId: parseInt(questionId), answer }
            })).unwrap()
        );

        try {
            await Promise.all(responsePromises);
            dispatch(markSurveyAsSubmitted(currentSurvey.id));
            showToast({
                title: 'Success',
                description: 'Survey submitted successfully!',
                status: 'success'
            });
            setIsSubmitted(true);
            setTimeout(() => navigate('/'), 3000);
        } catch (error) {
            console.error('An error occurred while submitting the survey:', error);
            showToast({
                title: 'Error',
                description: 'Failed to submit survey.',
                status: 'error'
            });
        }
    };    

    useEffect(() => {
        if (submissionSuccess && isSubmitted) {
            setTimeout(() => navigate('/'), 1000);
        }
    }, [submissionSuccess, navigate, isSubmitted]);

    if (!currentSurvey) {
        return <CenteredSpinner />;
    }

    return (
        <form onSubmit={handleSubmit} style={{ paddingTop: '20px' }}>
            <Flex direction='column' align='center' justify='center'>
                {loading && <CenteredSpinner />}
                {!loading && !error && (
                    <ErrorBoundary>
                        <SurveyQuestionsList 
                            key={currentSurvey.id}
                            surveyId={currentSurvey.id}
                        />
                    </ErrorBoundary>
                )}
                <Button colorScheme='blue' type='submit' mt={4}>Submit</Button>
            </Flex>
        </form>
    );
};

export default SurveyForm;