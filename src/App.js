import React, { useEffect } from 'react';

// react router
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// auth0
import { useAuth0 } from '@auth0/auth0-react';

// redux
import { useDispatch } from 'react-redux';

// chakra ui
import { ChakraProvider } from '@chakra-ui/react';

// custom components
import Navbar from './components/layout/Navbar';
import Login from './components/Login';
import SurveyForm from './components/SurveyForm';
import ManageQuestions from './components/ManageQuestions';
import Logout from './components/Logout';
import ProtectedRoute from './components/ProtectedRoute';
import SurveyList from './components/SurveyList';
import SurveyDetail from './components/SurveyDetail';

// reduc slices
import { fetchSurveyQuestions } from './store/slices/surveySlice';
import { login } from './store/slices/authSlice';

const App = () => {
  const { isAuthenticated, user } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchSurveyQuestions());
      console.log('User:', user);
      dispatch(login(user.sub)); // Dispatch login action with userId
  }
}, [isAuthenticated, user, dispatch]);

  return (
    <ChakraProvider>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/survey-list" />} />
          <Route path="/surveys/:surveyId" element={<SurveyDetail />} />
          <Route path="/survey-list" element={<ProtectedRoute component={SurveyList} />} />
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
