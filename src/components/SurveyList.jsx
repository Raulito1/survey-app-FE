import React, { useEffect } from 'react';

// Redux Hooks
import { useSelector, useDispatch } from 'react-redux';

// Redux Actions
import { fetchAllSurveys, resetSubmittedSurveys, selectAreAllSurveysSubmitted } from '../store/slices/surveySlice';

// Chakra UI Components
import { Box, Heading, Text, Stack, Button } from '@chakra-ui/react';

// React Router
import { Link } from 'react-router-dom';

// Components
import CenteredSpinner from './layout/CenteredSpinner';
import ErrorBoundary from './ErrorBoundary';

const SurveyList = () => {
    const dispatch = useDispatch();
    const surveys = useSelector(state => state.survey.surveys);
    const submittedSurveys = useSelector(state => state.survey.submittedSurveys); // Retrieve submitted surveys state
    const loading = useSelector(state => state.survey.loading);
    const error = useSelector(state => state.survey.error);
    const surveysLoaded = useSelector(state => state.survey.surveysLoaded);
    const areAllSurveysSubmitted = useSelector(selectAreAllSurveysSubmitted);

    useEffect(() => {
        if (!surveysLoaded) {
            dispatch(fetchAllSurveys());
        }
    }, [surveysLoaded, dispatch]);

    useEffect(() => {
        if (areAllSurveysSubmitted) {
            dispatch(resetSubmittedSurveys());
        }
    }, [areAllSurveysSubmitted, dispatch]);

    if (loading) {
        return <CenteredSpinner />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <ErrorBoundary>
            <Box textAlign="center">
                <Heading as="h1" size="xl" mb={5}>List of Surveys</Heading>
                {surveys.length > 0 ? (
                    <Stack spacing={3} align="center">
                        {surveys.map((survey) => {
                        const isSubmitted = submittedSurveys[survey.id]; // Use the correct state here
                        return (
                                <Box key={survey.id} p={5} shadow="md" borderWidth="1px">
                                    <Heading as="h2" size="lg">{survey.title}</Heading>
                                    <Text>{survey.description}</Text>
                                    {isSubmitted ? (
                                        <Text mt={3}>Survey Submitted. Thank you!</Text> 
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
        </ErrorBoundary>
    );
};

export default SurveyList;
