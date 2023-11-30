import React, { useEffect } from 'react';

// Redux Hooks
import { useSelector, useDispatch } from 'react-redux';

// react-router
import { useNavigate } from 'react-router-dom';

// Components
import SurveyQuestionsList from './SurveyQuestionsList';
import CenteredSpinner from './layout/CenteredSpinner';
import ErrorBoundary from './ErrorBoundary';

// Redux Actions
import { storeResponse, markSurveyAsSubmitted } from '../store/slices/surveySlice';
import  { logError } from '../store/slices/errorSlice';

// Chakra UI Components
import { Flex, Box, Button, Text } from '@chakra-ui/react';

const SurveyForm = () => {
    const dispatch = useDispatch();
    const survey = useSelector(state => state.survey);
    const { questions, answers, loading, error, surveyId, submissionSuccess } = survey;
    const userId = useSelector(state => state.auth.userId);
    const navigate = useNavigate();

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
                navigate('/');
            }, 3000);
        }
    }, [submissionSuccess, navigate]);
    
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
