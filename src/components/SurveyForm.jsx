import React, { useEffect } from 'react';

// Redux Hooks
import { useSelector, useDispatch } from 'react-redux';

// Components
import SurveyQuestionsList from './SurveyQuestionsList';
import CenteredSpinner from './layout/CenteredSpinner';
import ErrorBoundary from './ErrorBoundary';

// Redux Actions
import { storeResponse, markSurveyAsSubmitted } from '../store/slices/surveySlice';
import  { logError } from '../store/slices/errorSlice';
import { logout } from '../store/slices/authSlice';

// Chakra UI Components
import { Flex, Box, Button, Text } from '@chakra-ui/react';

// Auth0 hook
import { useAuth0 } from '@auth0/auth0-react'; 

const SurveyForm = () => {
    const dispatch = useDispatch();
    const { logout: auth0Logout } = useAuth0();
    const survey = useSelector(state => state.survey);
    const { questions, answers, loading, error, surveyId, submissionSuccess } = survey;
    const userId = useSelector(state => state.auth.userId);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = {
            responses: Object.entries(answers).map(([questionId, answer]) => ({
                questionId: parseInt(questionId),
                answer: answer || null
            }))
        };
        
        try {
            await dispatch(storeResponse({ userId, surveyId, response })).unwrap();
            dispatch(markSurveyAsSubmitted({ surveyId }));
        } catch (error) {
            dispatch(logError(error.message));
        }
    };

    useEffect(() => {
        if (submissionSuccess) {
            setTimeout(() => {
                dispatch(logout());
                auth0Logout({ returnTo: window.location.origin }); 
            }, 3000);
        }
    }, [submissionSuccess, dispatch, auth0Logout]);
    
    if (submissionSuccess) {
        return (
            <Box textAlign="center" py={10}>
                <Text fontSize="2xl">Thank you for submitting your feedback!</Text>
            </Box>
        );
    }

    return (
        <form type="submit" onSubmit={handleSubmit} style={{ paddingTop: '20px' }}>
            <Flex direction="column" align="center" justify="center">
                <Text fontSize="2xl" mb={4}>Survey Title</Text> 
                {loading && <div><CenteredSpinner /></div>}
                {error && <div>Error: {error}</div>}
                {!loading && !error && (
                    <ErrorBoundary>
                        <SurveyQuestionsList 
                            key={questions.id}
                            questionId={questions.id} 
                            questions={questions} 
                            answers={answers} 
                        />
                    </ErrorBoundary>
                )}
                <Button colorScheme="blue" type="submit" mt={4}>Submit</Button> 
            </Flex>
        </form>
    );
};

export default SurveyForm;
