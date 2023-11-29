import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllSurveys } from '../store/slices/surveySlice';
import { Box, Heading, Text, Stack, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import CenteredSpinner from './layout/CenteredSpinner';

const SurveyList = () => {
    const dispatch = useDispatch();
    const surveys = useSelector(state => state.survey.surveys);
    const submittedSurveys = useSelector(state => state.survey.submittedSurveys); // Retrieve submitted surveys state
    const loading = useSelector(state => state.survey.loading);
    const error = useSelector(state => state.survey.error);

    useEffect(() => {
        dispatch(fetchAllSurveys());
    }, [dispatch]);

    if (loading) {
        return <CenteredSpinner />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <Box textAlign="center"> {/* Add textAlign prop here */}
            <Heading as="h1" size="xl" mb={5}>List of Surveys</Heading>
            {surveys.length > 0 ? (
                <Stack spacing={3} align="center"> {/* Center align Stack items */}
                    {surveys.map((survey) => {
                        const isSubmitted = submittedSurveys[survey.id]; // Check if the current survey is submitted
                        return (
                            <Box key={survey.id} p={5} shadow="md" borderWidth="1px">
                                <Heading as="h2" size="lg">{survey.title}</Heading>
                                <Text>{survey.description}</Text>
                                {isSubmitted ? (
                                    <Text mt={3}>Survey Submitted. Thank you!</Text> // Or some other indication
                                ) : (
                                    <Link to={`/surveys/${survey.id}`}>
                                        <Button mt={3}>Take Survey</Button>
                                    </Link>
                                )}
                            </Box>
                        );
                    })}
                </Stack>
            ) : (
                <Text>No surveys found.</Text>
            )}
        </Box>
    );
};

export default SurveyList;
