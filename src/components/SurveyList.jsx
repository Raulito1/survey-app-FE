import React, { useEffect } from 'react';

// Redux Hooks
import { useSelector, useDispatch } from 'react-redux';

// Redux Actions
import { fetchAllSurveys, deleteSurvey, setEditingSurveyId } from '../store/slices/surveySlice';

// Chakra UI Components
import { Box, Text, Stack, Button } from '@chakra-ui/react';

// React Router
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Components
import CenteredSpinner from './layout/CenteredSpinner';
import ErrorBoundary from './ErrorBoundary';
import Title from './layout/Title';

const SurveyList = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const surveys = useSelector(state => state.survey.surveys);
    const submittedSurveys = useSelector(state => state.survey.submittedSurveys);
    const loading = useSelector(state => state.survey.loading);
    const error = useSelector(state => state.survey.error);
    const surveysLoaded = useSelector(state => state.survey.surveysLoaded);

    const userRoles = useSelector(state => state.auth.roles);
    const isAdmin = userRoles.includes('ADMIN');

    console.log('isAdmin', isAdmin)

    const isDeleteSurveyPage = location.pathname === '/delete-survey';
    const isEditSurveyPage = location.pathname === '/edit-survey';
    const isRefreshSurveyPage = location.pathname === '/refresh-survey';

    console.log('isDeleteSurveyPage', isDeleteSurveyPage)

    useEffect(() => {
        if (!surveysLoaded) {
            dispatch(fetchAllSurveys());
        }
    }, [surveysLoaded, dispatch]);

    if (loading) {
        return <CenteredSpinner />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    const handleDelete = async (surveyId) => {
        await dispatch(deleteSurvey(surveyId));
    };

    const handleEdit = (surveyId) => {
        dispatch(setEditingSurveyId(surveyId));
        navigate(`/edit-survey/${surveyId}`);
    };

    const handleRefresh = (surveyId) => {
        // TODO: Implement the logic to refresh a survey
    }

    return (
        <ErrorBoundary>
            <Box textAlign="center">
                <Title title="List of Surveys" />
                {surveys.length > 0 ? (
                    <Stack spacing={3} align="center">
                        {surveys.map((survey) => {
                            const isSubmitted = submittedSurveys[survey.id];
                            return (
                                <Box 
                                    key={survey.id} 
                                    p={5} 
                                    w="100%"
                                    maxW="75%"
                                    minWidth="300px"
                                    shadow="md" 
                                    borderWidth="1px">
                                    <Title title={survey.title} />
                                    <Text>{survey.description}</Text>
                                    {isAdmin && isDeleteSurveyPage && (
                                        <Button 
                                            mt={3}
                                            colorScheme="red"
                                            onClick={() => handleDelete(survey.id)}
                                        >
                                            Delete Survey
                                        </Button>
                                    )}

                                    {isAdmin && isEditSurveyPage && (
                                        <Button 
                                            mt={3}
                                            colorScheme="blue"
                                            onClick={() => handleEdit(survey.id)}
                                        >
                                            Edit Survey
                                        </Button>
                                    )}

                                    {isAdmin && isRefreshSurveyPage && (
                                        <Button 
                                            mt={3}
                                            colorScheme="blue"
                                            onClick={() => handleRefresh(survey.id)}
                                        >
                                            Refresh Survey
                                        </Button>
                                    )}

                                    {!isDeleteSurveyPage && !isEditSurveyPage && !isRefreshSurveyPage && (
                                        <>
                                        {isSubmitted ? (
                                            <Text mt={3}>Survey Submitted. Thank you!</Text>
                                        ) : (
                                            <Link to={`/surveys/${survey.id}`}>
                                                <Button mt={3}>Take Survey</Button>
                                            </Link>
                                        )}
                                    </>
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
