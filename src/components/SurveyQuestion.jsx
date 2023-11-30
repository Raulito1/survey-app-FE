import React from 'react';

// Custom Components
import QuestionTypeRenderer from './QuestionTypeRenderer';

// Imports for Chakra-UI components
import { Box, Text } from '@chakra-ui/react';

const SurveyQuestion = ({ questionId, question, options, type, answer }) => {
    return (
        <Box mb={4}> 
            <Text fontSize="lg" mb={2}>{question}</Text>
            <QuestionTypeRenderer 
                type={type} 
                questionId={questionId}
                options={options} 
            />
        </Box>
    );
};

export default SurveyQuestion;
