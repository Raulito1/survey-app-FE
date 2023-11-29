import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllSurveys } from '../store/slices/surveySlice';
import { Box, Heading, Text, Stack, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const SurveyList = () => {
    const dispatch = useDispatch();
    const surveys = useSelector(state => state.survey.surveys);

    useEffect(() => {
        dispatch(fetchAllSurveys());
    }, [dispatch]);

    return (
        <Box>
            <Heading as="h1" size="xl" mb={5}>Surveys</Heading>
            {surveys.length > 0 ? (
                <Stack spacing={3}>
                    {surveys.map((survey) => (
                        <Box key={survey.id} p={5} shadow="md" borderWidth="1px">
                            <Heading as="h2" size="lg">{survey.title}</Heading>
                            <Text>{survey.description}</Text>
                            <Link to={`/surveys/${survey.id}`}>
                                <Button mt={3}>Take Survey</Button>
                            </Link>
                        </Box>
                    ))}
                </Stack>
            ) : (
                <Text>No surveys found.</Text>
            )}
        </Box>
    );
}

export default SurveyList;