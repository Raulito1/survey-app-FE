import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';

// custom components
import Navbar from './components/layout/Navbar';
import Login from './components/Login';
import SurveyForm from './components/SurveyForm';
import ManageQuestions from './components/ManageQuestions';
import Logout from './components/Logout';
import ProtectedRoute from './components/ProtectedRoute'; // Import the PrivateRoute component

import { setUserId, fetchSurveyQuestions } from './store/slices/surveySlice';

const App = () => {
  const { isAuthenticated, user } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchSurveyQuestions());
      console.log('User:', user);
      const userId = user.sub; // 'sub' is typically the user ID in Auth0
      dispatch(setUserId(userId));
  }
}, [isAuthenticated, user, dispatch]);

  return (
    <ChakraProvider>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/survey-form" />} />
          <Route path="/survey-form" element={<ProtectedRoute component={SurveyForm} />} />
          <Route path="/manage-questions" element={<ProtectedRoute component={ManageQuestions} />} />
          <Route path="/logout" element={<Logout />} />
          {/* other routes */}
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
