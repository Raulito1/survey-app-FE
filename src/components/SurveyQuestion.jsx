import React from 'react';
import QuestionTypeRenderer from './QuestionTypeRenderer';

// Imports for Chakra-UI components
import { Box, Text } from '@chakra-ui/react';

const SurveyQuestion = ({ questionId, question, options, type, answer, handleAnswerChange }) => {
    return (
        <Box mb={4}> {/* Add margin-bottom for spacing */}
            <Text fontSize="lg" mb={2}>{question}</Text> {/* Question text */}
            <QuestionTypeRenderer 
                type={type} 
                questionId={questionId}
                options={options} 
                handleAnswerChange={handleAnswerChange}
            />
        </Box>
    );
};

export default SurveyQuestion;
