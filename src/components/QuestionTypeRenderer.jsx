import React from 'react';
import {
    Input,
    RadioGroup,
    Stack,
    Radio,
    Checkbox,
    CheckboxGroup,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
} from '@chakra-ui/react';

const QuestionTypeRenderer = ({ questionId, options, type, handleAnswerChange }) => {
    switch (type) {
        case 'text':
            return <Input placeholder="Type your answer here..." onChange={(e) => handleAnswerChange(questionId, e.target.value)} />;
        case 'boolean':
            return (
                <RadioGroup>
                    <Stack direction="row">
                        <Radio value="true" onChange={(e) => handleAnswerChange(questionId, e.target.value)}>Yes</Radio>
                        <Radio value="false" onChange={(e) => handleAnswerChange(questionId, e.target.value)}>No</Radio>
                    </Stack>
                </RadioGroup>
            );
        case 'single-select':
            return (
                <RadioGroup>
                    <Stack direction="column">
                        {options.map((option, index) => (
                            <Radio key={index} value={option} onChange={(e) => handleAnswerChange(questionId, e.target.value)}>
                                {option}
                            </Radio>
                        ))}
                    </Stack>
                </RadioGroup>
            );
        case 'multi-select':
            return (
                <CheckboxGroup>
                    <Stack direction="column">
                        {options.map((option, index) => (
                            <Checkbox key={index} value={option} onChange={(e) => handleAnswerChange(questionId, e.target.checked)}>
                                {option}
                            </Checkbox>
                        ))}
                    </Stack>
                </CheckboxGroup>
            );
        case 'slider':
            return (
                <Slider defaultValue={30} min={0} max={100} step={1} onChange={(val) => handleAnswerChange(questionId, val)}>
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb fontSize="sm" boxSize="32px" />
                </Slider>
            );
            case 'multiple-choice':
                return (
                    <RadioGroup>
                        <Stack direction="column">
                            {options.map((option, index) => (
                                <Radio key={index} value={option} onChange={(e) => handleAnswerChange(questionId, e.target.value)}>
                                    {option}
                                </Radio>
                            ))}
                        </Stack>
                    </RadioGroup>
                );
        default:
            return null;
    }
};

export default QuestionTypeRenderer;
