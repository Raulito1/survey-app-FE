// Custom Components
import QuestionTypeRenderer from './QuestionTypeRenderer';

// Imports for Chakra-UI components
import { Box, Text } from '@chakra-ui/react';

const SurveyQuestion = ({ survey }) => {
    const { content, type, id, options } = survey;
    
    return (
        <Box mb={4}> 
            <Text fontSize='lg' mb={2}>{content}</Text>
            <QuestionTypeRenderer 
                type={type} 
                questionId={id}
                options={options} 
            />
        </Box>
    );
};

export default SurveyQuestion;
