import React, { useEffect } from 'react';

// Chakra UI Components
import { Box, Stack, Text } from '@chakra-ui/react';

// Redux Hooks
import { useDispatch, useSelector } from 'react-redux';

// Redux Actions
import { fetchAllSurveys } from '../store/slices/surveySlice';

// Custom Components
import SurveyItem from './SurveyItem';
import CenteredSpinner from './layout/CenteredSpinner';
import Title from './layout/Title';

// Utility Functions
import { usePageType } from './../utils/uiUtils';
import useErrorAlert from '../hooks/useErrorAlert';

const SurveyList = () => {
    const dispatch = useDispatch();
    const surveys = useSelector(state => state.survey.surveys);
    const loading = useSelector(state => state.survey.loading);
    const surveysLoaded = useSelector(state => state.survey.surveysLoaded);
    const userRoles = useSelector(state => state.auth.roles);
    const pageType = usePageType();
    const errorAlert = useErrorAlert();

    useEffect(() => {
        if (!surveysLoaded) {
            dispatch(fetchAllSurveys());
        }
    }, [surveysLoaded, dispatch]);

    if (loading) {
        return (
            <>
                {errorAlert}
                <CenteredSpinner />
            </>
        );
    }

    return (
        <>
            {errorAlert}
            <Box textAlign='center'>
                <Title title='List of Surveys' />
                {surveys.length > 0 ? (
                    <Stack spacing={3} align='center'>
                        {surveys.map((survey) => (
                            <SurveyItem key={survey.id} survey={survey} pageType={pageType} userRoles={userRoles} />
                        ))}
                    </Stack>
                ) : <Text>No surveys found.</Text>}
            </Box>
        </>
    );
};


export default SurveyList;
