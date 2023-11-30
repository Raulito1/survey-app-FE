import React, { useState, useEffect } from 'react';

// Redux Hooks
import { useDispatch } from 'react-redux';

import { createSurvey } from '../store/slices/surveySlice';

// React Router
import { useNavigate } from 'react-router-dom';

import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    VStack,
    HStack,
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
    // TODO: Add state for survey title, description, and questions RTK
    const [surveyTitle, setSurveyTitle] = useState('');
    const [surveyDescription, setSurveyDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [surveyCreated, setSurveyCreated] = useState(false);

    const toast = useToast();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addQuestion = () => {
        setQuestions([...questions, { question: '', type: QuestionTypes.SINGLE_SELECT, options: [] }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
        setQuestions(newQuestions);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const addOptionToQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions[index].options = [...newQuestions[index].options, ''];
        setQuestions(newQuestions);
    };

    const updateOption = (questionIndex, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(newQuestions);
    };

    const removeOption = (questionIndex, optionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, oIndex) => oIndex !== optionIndex);
        setQuestions(newQuestions);
    };

    const handleCreateSurvey = async () => {
        // Validate data, then save/send
        console.log({ surveyTitle, surveyDescription, questions });
        toast({
            title: "Survey created.",
            description: "Your survey has been successfully created!",
            status: "success",
            duration: 9000,
            isClosable: true,
        });

        const surveyData = {
            title: surveyTitle,
            description: surveyDescription,
            questions: questions.map(({ question, type, options }) => ({
                question,
                type,
                options: options.filter((option) => option !== '')
            }))};
            
            try {
                await dispatch(createSurvey(surveyData)).unwrap();
                setSurveyCreated(true); // Set the state to true on successful creation
            } catch (error) {
            console.error('Failed to create survey:', error);
            // Handle the error state in your UI
            }
        }

        useEffect(() => {
            if (surveyCreated) {
              navigate('/survey-list'); // Navigate when the state changes
            }
        }, [surveyCreated, navigate]);

    return (
        <Container maxW="container.md" p={4}> {/* Container to control width and padding */}
            <VStack spacing={4} align="stretch">
            <FormControl>
                <FormLabel>Survey Title</FormLabel>
                <Input value={surveyTitle} onChange={(e) => setSurveyTitle(e.target.value)} />
            </FormControl>
            <FormControl>
                <FormLabel>Survey Description</FormLabel>
                <Textarea value={surveyDescription} onChange={(e) => setSurveyDescription(e.target.value)} />
            </FormControl>
            {questions.map((question, index) => (
                <HStack key={index}>
                <VStack align="stretch">
                    <FormControl>
                    <FormLabel>Question {index + 1}</FormLabel>
                    <Input value={question.question} onChange={(e) => updateQuestion(index, 'question', e.target.value)} />
                    </FormControl>
                    <FormControl>
                    <FormLabel>Question Type</FormLabel>
                    <Select value={question.type} onChange={(e) => updateQuestion(index, 'type', e.target.value)}>
                        {Object.values(QuestionTypes).map((type) => (
                        <option key={type} value={type}>
                            {type.replace('-', ' ').toUpperCase()}
                        </option>
                        ))}
                    </Select>
                    </FormControl>
                    {question.type !== QuestionTypes.SLIDER && question.type !== QuestionTypes.TEXT && (
                    <VStack align="stretch">
                        {question.options.map((option, optionIndex) => (
                        <HStack key={`option-${optionIndex}`}>
                            <Input
                            value={option}
                            onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                            />
                            <IconButton
                            aria-label="Remove option"
                            icon={<CloseIcon />}
                            onClick={() => removeOption(index, optionIndex)}
                            />
                        </HStack>
                        ))}
                        <Button onClick={() => addOptionToQuestion(index)}>Add Option</Button>
                    </VStack>
                    )}
                </VStack>
                <IconButton
                    aria-label="Remove question"
                    icon={<CloseIcon />}
                    onClick={() => removeQuestion(index)}
                />
                </HStack>
            ))}
            <Button onClick={addQuestion}>Add Question</Button>
            <Button colorScheme="blue" onClick={handleCreateSurvey}>Create Survey</Button>
            </VStack>
        </Container>
    );
};

export default CreateSurvey;
