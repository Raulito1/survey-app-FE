import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSurveyQuestions } from '../store/slices/surveySlice'; // Replace with your actual action
import SurveyForm from './SurveyForm';

const SurveyFormContainer = () => {
    const dispatch = useDispatch();
    const { questions, loading, error } = useSelector(state => state.survey);

    useEffect(() => {
        dispatch(fetchSurveyQuestions());
    }, [dispatch]);

    // Handle loading and error states
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return <SurveyForm questions={questions} />;
};

export default SurveyFormContainer;
