
const BASE_URL = 'http://localhost:3001';

export const storeResponse = async (userId, surveyId, response) => {
    try {
        const res = await fetch(`${BASE_URL}/answers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: userId,
                surveyId: surveyId,
                responses: response
            })    
        });
        const data = await res.json();

        return data;
    } catch (error) {
        if (error) {
            throw new Error('Failed to store response at the moment, please check back later');
        } else {
            throw error;
        }
    }
};

const getResponses = async (surveyId, userId) => {
    try {
        const response = await fetch(`${BASE_URL}/answers?surveyId=${surveyId}&userId=${userId}`);
        const data = await response.json();
        console.log('Responses received:', data);
        return data;
    } catch (error) {
        if (error) {
            throw new Error('Failed to retrieve responses at the moment, please check back later');
        } else {
            throw error;
        }
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
        if (error) {
            throw new Error('Failed to create a new survey at this time, please check back later');
        } else {
            throw error;
        }
    }
};

const deleteSurvey = async (surveyId) => {
    console.log('Deleting survey:', surveyId);
    try {
        const response = await fetch(`${BASE_URL}/surveys/${surveyId}`, {
            method: 'DELETE'
        });
        const data = await response.json();

        return data;
    } catch (error) {
        if (error) {
            throw new Error(`Failed to delete ${surveyId} at the moment, please check back later`);
        } else {
            throw error;
        }
    }
};

const fetchAllSurveys = async () => {
    try {
        const response = await fetch(`${BASE_URL}/surveys`);
        const data = await response.json();
        
        return data;
    } catch (error) {
        if (error) {
            throw new Error('Failed to fetch surveys at the moment, please check back later');
        } else {
            throw error;
        }
    }
};


const fetchSurveyById = async (surveyId) => {
    try {
        const response = await fetch(`${BASE_URL}/surveys/${surveyId}`);
        const data = await response.json();

        console.log('Survey data received:', data);

        return data;
    } catch (error) {
        if (error) {
            throw new Error(`Failed to fetch survey ${surveyId} at the moment, please check back later`);
        } else {
            throw error;
        }
    }
};

export const refreshSurvey = async (surveyId) => {
    try {
        const response = await fetch(`${BASE_URL}/surveys/${surveyId}`);
        const surveyData = await response.json();

        surveyData.lastRefreshed = new Date().toISOString();

        const refreshResponse = await fetch(`${BASE_URL}/surveys/${surveyId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(surveyData),
        });

        return await refreshResponse.json();
    } catch (error) {
        console.error('Failed to refresh survey:', error);
        throw new Error(`Failed to refresh survey ${surveyId} at the moment, please check back later`);
    }
};

export const updateSurvey = async (surveyData) => {
    const { id, ...data } = surveyData;
    try {
        const response = await fetch(`${BASE_URL}/surveys/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) 
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const updatedData = await response.json();
        return updatedData;
    } catch (error) {
        console.error('Failed to update survey:', error);
        throw new Error(`Failed to update survey ${id} at this time, please check back later`);
    }
};


export const surveyService = {
    storeResponse,
    getResponses,
    fetchSurveyById,
    createSurvey,
    deleteSurvey,
    fetchAllSurveys,
    refreshSurvey,
    updateSurvey
};
