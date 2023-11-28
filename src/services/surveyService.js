
const BASE_URL = 'http://localhost:3001';

const storeResponse = async (userId, surveyId, responseDto) => {
    const response = await fetch(`${BASE_URL}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            id: userId,
            surveyId: surveyId, 
            responses: responseDto
        })    });
    const data = await response.json();
    return data;
};

const getResponses = async (surveyId, userId) => {
    console.log('Fetching responses:', { surveyId, userId });
    try {
        const response = await fetch(`${BASE_URL}/answers?surveyId=${surveyId}&userId=${userId}`);
        const data = await response.json();
        console.log('Responses received:', data);
        return data;
    } catch (error) {
        console.error('Error in getResponses:', error);
        throw error;
    }
};

const createSurvey = async (surveyCreateDTO) => {
    console.log('Creating survey:', surveyCreateDTO);
    try {
        const response = await fetch(`${BASE_URL}/surveys`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(surveyCreateDTO)
        });
        const data = await response.json();
        console.log('Survey created:', data);
        return data;
    } catch (error) {
        console.error('Error in createSurvey:', error);
        throw error;
    }
};

const deleteSurvey = async (surveyId) => {
    console.log('Deleting survey:', surveyId);
    try {
        const response = await fetch(`${BASE_URL}/surveys/${surveyId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        console.log('Survey deleted:', data);
        return data;
    } catch (error) {
        console.error('Error in deleteSurvey:', error);
        throw error;
    }
};

const getAllSurveys = async () => {
    console.log('Fetching all surveys');
    try {
        const response = await fetch(`${BASE_URL}/surveys`);
        const data = await response.json();
        console.log('All surveys:', data);
        return data;
    } catch (error) {
        console.error('Error in getAllSurveys:', error);
        throw error;
    }
};

export const surveyService = {
    storeResponse,
    getResponses,
    createSurvey,
    deleteSurvey,
    getAllSurveys,
};
