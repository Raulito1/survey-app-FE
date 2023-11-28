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

const QuestionTypeRenderer = ({ question, answerOptions, type, onChange }) => {
    switch (type) {
        case 'text':
            return <Input placeholder="Type your answer here..." onChange={onChange} />;
        case 'boolean':
            return (
                <RadioGroup>
                    <Stack direction="row">
                        <Radio value="true" onChange={onChange}>Yes</Radio>
                        <Radio value="false" onChange={onChange}>No</Radio>
                    </Stack>
                </RadioGroup>
            );
        case 'single-select':
            return (
                <RadioGroup>
                    <Stack direction="column">
                        {answerOptions.map((option, index) => (
                            <Radio key={index} value={option} onChange={onChange}>
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
                        {answerOptions.map((option, index) => (
                            <Checkbox key={index} value={option} onChange={onChange}>
                                {option}
                            </Checkbox>
                        ))}
                    </Stack>
                </CheckboxGroup>
            );
        case 'slider':
            return (
                <Slider defaultValue={30} min={0} max={100} step={1} onChange={onChange}>
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb fontSize="sm" boxSize="32px" />
                </Slider>
            );
        // ... other question types

        default:
            return null;
    }
};

export default QuestionTypeRenderer;
