// Chakra UI Components
import { Button } from '@chakra-ui/react';

const AdminSurveyActions = ({ surveyId, pageType, onEdit, onDelete, onRefresh }) => {
    return (
        <>
            {pageType === 'delete' && (
                <Button colorScheme='red' mt={3} onClick={() => onDelete(surveyId)}>Delete Survey</Button>
            )}
            {pageType === 'edit' && (
                <Button colorScheme='blue' mt={3} onClick={() => onEdit(surveyId)}>Edit Survey</Button>
            )}
            {pageType === 'refresh' && (
                <Button colorScheme='blue' mt={3} onClick={() => onRefresh(surveyId)}>Refresh Survey</Button>
            )}
        </>
    );
};

export default AdminSurveyActions;
