// Chakra UI Components
import { Box, Button, Text } from '@chakra-ui/react';

// React Router
import { Link, useNavigate } from 'react-router-dom';

// Redux
import { useDispatch, useSelector } from 'react-redux';

// Redux Actions
import { deleteSurvey, setEditingSurveyId, refreshSurvey, toggleSurveySubmit } from '../store/slices/surveySlice';

// Custom Components
import AdminSurveyActions from './AdminSurveyActions';
import Title from './layout/Title';
import NotificationToast from './layout/NotificationToast';

const SurveyItem = ({ survey, pageType, userRoles }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const submittedSurveys = useSelector(state => state.survey.submittedSurveys);
    const isAdmin = userRoles.includes('ADMIN');
    const isSubmitted = submittedSurveys[survey.id];
    const { showToast } = NotificationToast();

    const handleDelete = async (surveyId) => {
        await dispatch(deleteSurvey(surveyId));
    };

    const handleEdit = (surveyId) => {
        dispatch(setEditingSurveyId(surveyId));
        navigate(`/edit-survey/${surveyId}`);
    };

    const handleRefresh = async (surveyId) => {
        try {
            await dispatch(refreshSurvey(surveyId)).unwrap();
            showToast({
                title: 'Survey refreshed',
                description: 'The survey has been successfully refreshed.',
                status: 'success'
            });
            // diable the refresh button

            dispatch(toggleSurveySubmit(surveyId));
        } catch (error) {
            // Error handling is done by useErrorAlert hook
        }
    }

    return (
        <Box p={5} w='100%' maxW='75%' minWidth='300px' shadow='md' borderWidth='1px'>
            <Title title={survey.title} />
            <Text>{survey.description}</Text>
            {isAdmin && <AdminSurveyActions surveyId={survey.id} pageType={pageType} onEdit={handleEdit} onDelete={handleDelete} onRefresh={handleRefresh} />}
            {!isSubmitted ? (
                <Link to={`/surveys/${survey.id}`}>
                    <Button mt={3}>Take Survey</Button>
                </Link>
            ) : <Text mt={3}>Survey Submitted. Thank you!</Text>}
        </Box>
    );
};

export default SurveyItem;