// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';

import { ChakraProvider } from '@chakra-ui/react'

import Login from './components/Login';
import OAuthCallback from './components/OAuthCallback';
import SurveyForm from './components/SurveyForm';

import CenteredSpinner from './components/layout/CenteredSpinner';

const ProtectedSurveyForm = withAuthenticationRequired(SurveyForm, {
  onRedirecting: () => <CenteredSpinner />,
});

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route path="/survey-form" element={<ProtectedSurveyForm />} />
          {/* other routes */}
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
