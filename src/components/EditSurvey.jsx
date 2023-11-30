import React, { useEffect } from 'react';

// React Router
import { useParams } from 'react-router-dom';

// Redux Hooks
import { useSelector, useDispatch } from 'react-redux';

// Redux Actions
import { fetchSurveyById } from '../store/slices/surveySlice';

// Custom Components
import CenteredSpinner from './layout/CenteredSpinner';

// Chakra UI Components
import {
    Container, VStack, FormControl, FormLabel, Input, 
    Textarea, HStack, Select, IconButton, Button
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const EditSurvey = () => {
    const { surveyId } = useParams();
    const dispatch = useDispatch();
    const survey = useSelector(state => state.survey.currentSurvey);

    useEffect(() => {
        dispatch(fetchSurveyById(surveyId));
    }, [dispatch, surveyId]);

    if (!survey) {
        return <CenteredSpinner />;
    }

    const handleUpdateSurvey = () => {
        // TODO: Implement the logic to handle survey update
    };

    const updateQuestion = (index, field, value) => {
        // TODO: Implement the logic to update a question
    };

    const updateOption = (questionIndex, optionIndex, value) => {
        // TODO: Implement the logic to update an option for a question
    };

    const updateTitle = (value) => {
        // TODO: Implement the logic to update the survey title
    }

    const updateDescription = (value) => {
        // TODO: Implement the logic to update the survey description
    }

    const removeQuestion = (index) => {
        // TODO: Implement the logic to remove a question
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
                    <HStack key={index}>
                        <VStack align='stretch'>
                            <FormControl>
                                <FormLabel>Question {index + 1}</FormLabel>
                                <Input value={question.question} onChange={(e) => updateQuestion(index, 'question', e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Question Type</FormLabel>
                                <Select value={question.type} onChange={(e) => updateQuestion(index, 'type', e.target.value)}>
                                    {/* Populate options based on question types */}
                                </Select>
                            </FormControl>
                            {/* Render options based on question type */}
                        </VStack>
                        <IconButton
                            aria-label='Remove question'
                            icon={<CloseIcon />}
                            onClick={() => removeQuestion(index)}
                        />
                    </HStack>
                ))}
                <Button colorScheme='blue' onClick={handleUpdateSurvey}>Update Survey</Button>
            </VStack>
        </Container>
    );
};

export default EditSurvey;
