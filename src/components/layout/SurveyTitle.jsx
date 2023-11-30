import { Box, Heading } from '@chakra-ui/react';

const SurveyTitle = ({ title }) => {
    return (
        <Box className="survey-title" p={4} my={4} textAlign="center">
            <Heading as="h1" size="xl">{title}</Heading>
        </Box>
    );
};

export default SurveyTitle;
