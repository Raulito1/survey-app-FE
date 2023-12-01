import React, { useState, useEffect } from 'react';

// Redux Hooks
import { useDispatch, useSelector } from 'react-redux';

// Redux Actions
import { 
    createSurvey,
    updateNewSurveyTitle, 
    updateNewSurveyDescription, 
    addNewSurveyQuestion, 
    updateNewSurveyQuestion, 
    removeNewSurveyQuestion,
    addOptionToNewSurveyQuestion, 
    updateOptionInNewSurveyQuestion, 
    removeOptionFromNewSurveyQuestion,
} from '../store/slices/surveySlice';

// React Router
import { useNavigate } from 'react-router-dom';

// Chakra UI Components
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Select,
    HStack,
    Textarea,
    VStack,
    IconButton,
    useToast,
    Container
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const QuestionTypes = {
    SINGLE_SELECT: 'single-select',
    MULTI_SELECT: 'multi-select',
    SLIDER: 'slider',
    BOOLEAN: 'boolean',
    TEXT: 'text'
};

const CreateSurvey = () => {
    const toast = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const newSurvey = useSelector(state => state.survey.newSurvey);
    const [surveyCreated, setSurveyCreated] = useState(false);

    console.log('CreateSurvey.jsx: newSurvey', newSurvey);
    const handleCreateSurvey = async () => {
        toast({
            title: 'Survey created.',
            description: 'Your survey has been successfully created!',
            status: 'success',
            duration: 9000,
            isClosable: true,
        });

    const surveyData = {
        title: newSurvey.title,
        description: newSurvey.description,
        questions: newSurvey.questions.map(({ question, type, options }) => ({
            question,
            type,
            options: options.filter((option) => option !== '')
        }))};
        
        try {
            await dispatch(createSurvey(surveyData)).unwrap();
            setSurveyCreated(true);
        } catch (error) {
            console.error('Failed to create survey:', error);
            // Handle the error state in your UI
        }
    }

    useEffect(() => {
        if (surveyCreated) {
            navigate('/survey-list');
        }
    }, [surveyCreated, navigate]);

    return (
        <Container maxW='container.md' p={4}>
            <VStack spacing={4} align='stretch'>
                <FormControl>
                    <FormLabel>Survey Title</FormLabel>
                    <Input 
                        value={newSurvey.title} 
                        onChange={(e) => dispatch(updateNewSurveyTitle(e.target.value))} 
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Survey Description</FormLabel>
                    <Textarea 
                        value={newSurvey.description} 
                        onChange={(e) => dispatch(updateNewSurveyDescription(e.target.value))} 
                    />
                </FormControl>
                {newSurvey.questions.map((question, index) => (
                    <VStack key={index} align='stretch' spacing={4}>
                        <HStack width='100%'>
                        <IconButton
                            aria-label='Remove question'
                            icon={<CloseIcon />}
                            size='sm'
                            variant='ghost'
                            onClick={() => dispatch(removeNewSurveyQuestion(index))}
                        />
                        <InputGroup flex='1'>
                            <Input 
                            value={question.question} 
                            size='md'
                            width='100%'
                            onChange={(e) => dispatch(updateNewSurveyQuestion({ 
                                index, 
                                field: 'question', 
                                value: e.target.value 
                            }))}
                            placeholder={`Question ${index + 1}`}
                            />
                        </InputGroup>
                        </HStack>
                        <FormControl>
                        <FormLabel>Question Type</FormLabel>
                        <Select 
                            value={question.type} 
                            size='md'
                            onChange={(e) => dispatch(updateNewSurveyQuestion({ 
                                index, 
                                field: 'type', 
                                value: e.target.value 
                            }))}
                        >
                            {Object.values(QuestionTypes).map((type) => (
                                <option key={type} value={type}>
                                    {type.replace('-', ' ').toUpperCase()}
                                </option>
                            ))}
                        </Select>
                        </FormControl>
                        {question.type !== QuestionTypes.SLIDER && question.type !== QuestionTypes.TEXT && (
                        <VStack align='stretch'>
                            {question.options.map((option, optionIndex) => (
                            <InputGroup key={`option-${optionIndex}`}>
                                <Input
                                value={option}
                                onChange={(e) => dispatch(updateOptionInNewSurveyQuestion({ 
                                    questionIndex: index, 
                                    optionIndex, 
                                    value: e.target.value 
                                }))}
                                placeholder={`Option ${optionIndex + 1}`}
                                />
                                <InputRightElement width='3rem'>
                                <IconButton
                                    aria-label='Remove option'
                                    icon={<CloseIcon />}
                                    size='sm'
                                    onClick={() => dispatch(removeOptionFromNewSurveyQuestion({ 
                                        questionIndex: index, 
                                        optionIndex 
                                    }))}
                                />
                                </InputRightElement>
                            </InputGroup>
                            ))}
                            <Button onClick={() => dispatch(addOptionToNewSurveyQuestion(index))}>Add Option</Button>
                        </VStack>
                        )}
                    </VStack>
                ))}
            <Button onClick={() => dispatch(addNewSurveyQuestion())}>Add Question</Button>
                <Button colorScheme='blue' onClick={handleCreateSurvey}>Create Survey</Button>
            </VStack>
        </Container>
    );
};

export default CreateSurvey;
