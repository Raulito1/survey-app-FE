import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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
    Tooltip
} from '@chakra-ui/react';

import { setAnswers } from '../store/slices/surveySlice';

const QuestionTypeRenderer = ({ questionId, options, type }) => {
    const dispatch = useDispatch();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [sliderValue, setSliderValue] = useState(5);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleChange = (value) => {
        dispatch(setAnswers({ questionId, answer: value }));
    };

    switch (type) {
        case 'text':
            return <Input placeholder="Type your answer here..." onChange={(e) => handleChange(e.target.value)} />;
        case 'boolean':
            return (
                <RadioGroup onChange={(e) => handleChange(e.target.value === 'true')}>
                    <Stack direction="row">
                        <Radio value="true">Yes</Radio>
                        <Radio value="false">No</Radio>
                    </Stack>
                </RadioGroup>
            );
        case 'single-select':
            return (
                <RadioGroup onChange={(e) => handleChange(e.target.value)}>
                    <Stack direction="column">
                        {options.map((option, index) => (
                            <Radio key={index} value={option}>{option}</Radio>
                        ))}
                    </Stack>
                </RadioGroup>
            );
        case 'multi-select':
            return (
                <CheckboxGroup value={selectedOptions} onChange={(values) => {
                    setSelectedOptions(values); 
                    handleChange(values); 
                }}>
                    <Stack direction="column">
                        {options.map((option, index) => (
                            <Checkbox key={index} value={option}>{option}</Checkbox>
                        ))}
                    </Stack>
                </CheckboxGroup>
            );
        case 'slider':
            return (
                <Slider
                    defaultValue={5}
                    min={1}
                    max={10}
                    step={1}
                    onChange={(val) => {
                        setSliderValue(val);
                        handleChange(val);
                    }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <Tooltip
                        hasArrow
                        label={sliderValue.toString()}
                        placement="top"
                        isOpen={showTooltip}
                        bg="gray.300"
                        color="black"
                    >
                        <SliderThumb fontSize="sm" boxSize="32px" />
                    </Tooltip>
                </Slider>
            );
            case 'multiple-choice':
                return (
                    <RadioGroup onChange={(value) => handleChange(value)}>
                        <Stack direction="column">
                            {options.map((option, index) => (
                                <Radio key={index} value={option}>{option}</Radio>
                            ))}
                        </Stack>
                    </RadioGroup>
                );
            default:
                return null;
    }
};

export default QuestionTypeRenderer;
