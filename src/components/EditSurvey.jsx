import React, { useEffect } from 'react';

// React Router
import { useParams, useNavigate } from 'react-router-dom';

// Redux Hooks
import { useSelector, useDispatch } from 'react-redux';

// Redux Actions
import { 
    surveySlice,
    fetchSurveyById,
    updateSurveyDetails
} from '../store/slices/surveySlice';


// Custom Components
import CenteredSpinner from './layout/CenteredSpinner';

// Chakra UI Components
import {
    Container, 
    VStack, 
    FormControl, 
    FormLabel, 
    Input,
    InputGroup,
    Textarea, HStack, Select, IconButton, Button
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const EditSurvey = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { surveyId } = useParams();
    const survey = useSelector(state => state.survey.currentSurvey);

    const updateTitle = (value) => {
        dispatch(surveySlice.actions.updateSurveyTitle(value));
    }

    const updateDescription = (value) => {
        dispatch(surveySlice.actions.updateSurveyDescription(value));
    }

    const updateQuestion = (index, field, value) => {
        dispatch(surveySlice.actions.updateSurveyQuestion({ index, field, value }));
    };

    const removeQuestion = (index) => {
        dispatch(surveySlice.actions.removeSurveyQuestion(index));
    }

    const handleUpdateSurvey = async () => {
        try {
            await dispatch(updateSurveyDetails({ id: surveyId, ...survey })).unwrap();
            navigate('/survey-list');
        } catch (error) {
            console.error('Failed to update the survey:', error);
            // Handle error here (e.g., showing an error message)
        }
    };


    useEffect(() => {
        dispatch(fetchSurveyById(surveyId));
    }, [dispatch, surveyId]);

    if (!survey) {
        return <CenteredSpinner />;
    }

    return (
        <Container maxW='container.md' p={4}>
            <VStack spacing={4} align='stretch'>
            <FormControl>
                <FormLabel>Survey Title</FormLabel>
                <Input value={survey.title} onChange={(e) => updateTitle(e.target.value)} />
            </FormControl>
            <FormControl>
                <FormLabel>Survey Description</FormLabel>
                <Textarea value={survey.description} onChange={(e) => updateDescription(e.target.value)} />
            </FormControl>
            {survey.questions.map((question, index) => (
                <VStack key={index} align='stretch' spacing={4}>
                <HStack width='100%'>
                    <IconButton
                    aria-label='Remove question'
                    icon={<CloseIcon />}
                    size='sm'
                    variant='ghost'
                    onClick={() => removeQuestion(index)}
                    />
                    <InputGroup flex='1'>
                    <Input
                        value={question.question}
                        onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                        size='md'
                        width='100%'
                        placeholder={`Question ${index + 1}`}
                    />
                    </InputGroup>
                </HStack>
                <FormControl>
                    <FormLabel>Question Type</FormLabel>
                    <Select
                    value={question.type}
                    size='md'
                    onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                    >
                    {/* Populate options based on question types */}
                    </Select>
                </FormControl>
                {/* Render options based on question type, similar to the above CreateSurvey component */}
                </VStack>
            ))}
            <Button colorScheme='blue' onClick={handleUpdateSurvey}>Update Survey</Button>
            </VStack>
        </Container>
    );
};

export default EditSurvey;
