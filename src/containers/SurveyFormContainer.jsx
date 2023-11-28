import React from 'react';
import { useSelector } from 'react-redux';
import SurveyForm from './SurveyForm';

const SurveyFormContainer = () => {
    const { questions, loading, error } = useSelector(state => state.survey);

    // Add a log to check for remounts
    console.log('SurveyFormContainer rendered');
    // Handle loading and error states
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return <SurveyForm questions={questions} />;
};

export default SurveyFormContainer;
