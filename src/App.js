import React, { useEffect } from 'react';

// react router
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// auth0
import { useAuth0 } from '@auth0/auth0-react';

// redux
import { useDispatch, useSelector } from 'react-redux';

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

// reduce slices
import { fetchAllSurveys } from './store/slices/surveySlice';
import { login, getUserRoles } from './store/slices/authSlice';

const App = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const surveysLoaded = useSelector(state => state.survey.surveysLoaded);
  const userRoles = useSelector((state) => state.auth.roles); // Retrieve roles from Redux store


  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchAllSurveys());
      dispatch(login(user.sub));
      dispatch(getUserRoles(getAccessTokenSilently))
    }
  }, [isAuthenticated, user, surveysLoaded, getAccessTokenSilently, dispatch]);

// Log the roles to the console
useEffect(() => {
  console.log('User roles:', userRoles);
}, [userRoles]);

  return (
    <ChakraProvider>
      <Navbar user={user} />
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
