import React from 'react';

// Custom Components
import Title from './layout/Title';
import SurveyList from './SurveyList';

const DeleteSurvey = () => {
    return (
        <div>
            <Title title='Delete a Survey' />
            <SurveyList />
        </div>
    );
};

export default DeleteSurvey;
