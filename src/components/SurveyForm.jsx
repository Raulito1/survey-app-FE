import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import SurveyQuestionsList from './SurveyQuestionsList';

import { setAnswers, storeResponse } from '../store/slices/surveySlice';
import setError from '../store/slices/errorSlice';

// Chakra UI Components
import { Flex, Button, Text } from '@chakra-ui/react';

const SurveyForm = () => {
    const dispatch = useDispatch();
    const survey = useSelector(state => state.survey);
    const { questions, answers, loading, error } = survey;
    const userId = useSelector(state => state.survey.userId); 
    const surveyId = useSelector(state => state.survey.surveyId); // Retrieve surveyId from the state


    console.log('SurveyForm rendered', surveyId); // Debugging log

        
    const handleAnswerChange = (questionId, answerValue) => {
        // Update the answers in the store
        dispatch(setAnswers({ questionId, answer: answerValue }));
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Format the answers properly for the API
        console.log("Answers:", answers); // Debugging log
        const responseDto = {
            responses: Object.entries(answers).map(([questionId, answer]) => ({
                questionId: parseInt(questionId),
                answer: answer || null
            }))
        };
        

        try {
            // Submit the survey response
            await dispatch(storeResponse({ userId, surveyId, responseDto })).unwrap();
            // Handle successful submission here, e.g., show a message or redirect
        } catch (error) {
            // Handle error
            dispatch(setError(error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ paddingTop: '20px' }}>
            <Flex direction="column" align="center" justify="center">
                <Text fontSize="2xl" mb={4}>Survey Title</Text> {/* Survey Title */}
                {loading && <div>Loading...</div>}
                {error && <div>Error: {error}</div>}
                {!loading && !error && (
                    <SurveyQuestionsList 
                        key={questions.id}
                        questionId={questions.id} 
                        questions={questions} 
                        answers={answers} 
                        handleAnswerChange={handleAnswerChange} 
                    />
                )}
                <Button colorScheme="blue" type="submit" mt={4}>Submit</Button> {/* Chakra UI Button */}
            </Flex>
        </form>
    );
};

export default SurveyForm;
