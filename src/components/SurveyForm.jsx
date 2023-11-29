import React from 'react';

// Redux Hooks
import { useSelector, useDispatch } from 'react-redux';

// React Router
import { useNavigate } from 'react-router-dom';

// Components
import SurveyQuestionsList from './SurveyQuestionsList';

// Redux Actions
import { storeResponse, markSurveyAsSubmitted } from '../store/slices/surveySlice';
import  { logError } from '../store/slices/errorSlice';
import { logout } from '../store/slices/authSlice';

// Chakra UI Components
import { Flex, Box, Button, Text } from '@chakra-ui/react';

// Auth0 hook
import { useAuth0 } from '@auth0/auth0-react'; 
import CenteredSpinner from './layout/CenteredSpinner';

const SurveyForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { logout: auth0Logout } = useAuth0();
    const survey = useSelector(state => state.survey);
    const { questions, answers, loading, error, surveyId, submittedSurveys, submissionSuccess } = survey;
    const userId = useSelector(state => state.auth.userId);
    const hasAlreadySubmitted = submittedSurveys[surveyId];

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = {
            userId: userId, 
            surveyId: surveyId,
            responses: Object.entries(answers).map(([questionId, answer]) => ({
                questionId: parseInt(questionId),
                answer: answer || null
            }))
        };
        

        try {
            await dispatch(storeResponse({ response })).unwrap();
            console.log("Survey response stored:");
            console.log("Dispatching markSurveyAsSubmitted for surveyId:", surveyId);
            dispatch(markSurveyAsSubmitted(surveyId));
            setTimeout(() => {
                dispatch(logout());
                auth0Logout({ returnTo: window.location.origin }); 
            }, 3000); // Delay of 3 seconds

        } catch (error) {
            // Handle error
            dispatch(logError(error.message));
        }
    };
    
    if (submissionSuccess) {
        return (
            <Box textAlign="center" py={10}>
                <Text fontSize="2xl">Thank you for submitting your feedback!</Text>
                {/* The thank you message will be displayed for 3 seconds before redirect */}
            </Box>
        );
    }

    if (hasAlreadySubmitted) {
        return (
            <Box textAlign="center" py={10}>
                <Text fontSize="2xl">You have already submitted this survey. Please fill out a different survey.</Text>
                <Button colorScheme="blue" mt={4} onClick={() => navigate('/survey-list')}>
                    Go to Home
                </Button>
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
                    <SurveyQuestionsList 
                        key={questions.id}
                        questionId={questions.id} 
                        questions={questions} 
                        answers={answers} 
                    />
                )}
                <Button colorScheme="blue" type="submit" mt={4}>Submit</Button> 
            </Flex>
        </form>
    );
};

export default SurveyForm;
