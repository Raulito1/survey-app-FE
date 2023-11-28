import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/public/surveys';

const storeResponse = (surveyId, responseDto) => {
    return axios.post(`${BASE_URL}/${surveyId}/responses`, responseDto);
};

const getResponses = (surveyId, userId) => {
    return axios.get(`${BASE_URL}/${surveyId}/responses/${userId}`);
};

const createSurvey = (surveyCreateDTO) => {
    return axios.post(`${BASE_URL}/create`, surveyCreateDTO);
};

const deleteSurvey = (surveyId) => {
    return axios.delete(`${BASE_URL}/${surveyId}`);
};

const getAllSurveys = () => {
    return axios.get(`${BASE_URL}/`);
};

export const surveyService = {
    storeResponse,
    getResponses,
    createSurvey,
    deleteSurvey,
    getAllSurveys,
};
