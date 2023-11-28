import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { withAuthenticationRequired, useAuth0 } from '@auth0/auth0-react';

import { ChakraProvider } from '@chakra-ui/react';

// custom components
import Login from './components/Login';
import SurveyForm from './components/SurveyForm';
import ManageQuestions from './components/ManageQuestions';

import CenteredSpinner from './components/layout/CenteredSpinner';
import Logout from './components/Logout';

const ProtectedSurveyForm = withAuthenticationRequired(SurveyForm, {
  onRedirecting: () => <CenteredSpinner />,
});

const ProtectedManageQuestions = withAuthenticationRequired(ManageQuestions, {
  // You can provide a component to render while the redirect is happening
  onRedirecting: () => <CenteredSpinner />,
});

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/survey-form" /> : <Login />} />
          <Route path="/survey-form" element={<ProtectedSurveyForm />} />
          <Route path="/manage-questions" element={<ProtectedManageQuestions />} />
          <Route path="/logout" element={<Logout />} />
          {/* other routes */}
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
