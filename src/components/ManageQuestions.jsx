import React, { useState } from 'react';
import { Box, Button, Input, Stack, IconButton, useToast } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';


const ManageQuestions = () => {
    // ... All the state and functions ...
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [editingIndex, setEditingIndex] = useState(-1);
    const toast = useToast();

    const handleAddQuestion = () => {
        if (questions.length >= 10) {
            toast({
                title: "Limit Reached",
                description: "You cannot add more than 10 questions.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        setQuestions([...questions, currentQuestion]);
        setCurrentQuestion('');
    };
    
    const handleEditQuestion = (index) => {
        setCurrentQuestion(questions[index]);
        setEditingIndex(index);
    };
    
    const handleUpdateQuestion = () => {
        let updatedQuestions = [...questions];
        updatedQuestions[editingIndex] = currentQuestion;
        setQuestions(updatedQuestions);
        setEditingIndex(-1);
        setCurrentQuestion('');
    };

    const handleDeleteQuestion = (index) => {
        setQuestions(questions.filter((_, idx) => idx !== index));
    };

    return (
        <Stack spacing={3}>
            <Input 
                placeholder="Enter your question here" 
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
            />
            {editingIndex === -1 ? (
                <Button onClick={handleAddQuestion}>Add Question</Button>
            ) : (
                <Button onClick={handleUpdateQuestion}>Update Question</Button>
            )}
            {questions.map((question, index) => (
                <Box key={index} d="flex" alignItems="center">
                    {question}
                    <IconButton 
                        icon={<EditIcon />} 
                        onClick={() => handleEditQuestion(index)}
                        ml={2}
                    />
                    <IconButton 
                        icon={<DeleteIcon />} 
                        onClick={() => handleDeleteQuestion(index)}
                        ml={2}
                    />
                </Box>
            ))}
        </Stack>
    );
};

export default ManageQuestions;
