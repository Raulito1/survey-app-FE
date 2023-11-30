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
import CreateSurvey from './components/CreateSurvey';
import ProtectedRoute from './components/ProtectedRoute';
import SurveyList from './components/SurveyList';
import SurveyDetail from './components/SurveyDetail';
import DeleteSurvey from './components/DeleteSurvey';

// reduce slices
import { fetchAllSurveys } from './store/slices/surveySlice';
import { login, setUserRoles } from './store/slices/authSlice';
import EditSurvey from './components/EditSurvey';

const App = () => {
  const { isAuthenticated, user } = useAuth0();
  const dispatch = useDispatch();
  const surveysLoaded = useSelector(state => state.survey.surveysLoaded);

  useEffect(() => {
    if (isAuthenticated && user) {
      const roles = user['http://my-survey-app.com/roles'];

      dispatch(fetchAllSurveys());
      dispatch(login(user.sub));
      dispatch(setUserRoles(roles))
    }
  }, [isAuthenticated, user, surveysLoaded, dispatch]);

  return (
    <ChakraProvider>
      <Router>
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/survey-list" />} />
          <Route path="/surveys/:surveyId" element={<SurveyDetail />} />
          <Route path="/survey-list" element={<SurveyList />} />
          <Route path="/create-survey" element={<ProtectedRoute component={CreateSurvey} />} />
          <Route path="/edit-survey" element={<ProtectedRoute component={SurveyList} />} />
          <Route path="/edit-survey/:surveyId" element={<ProtectedRoute component={EditSurvey}/>} />
          <Route path="/delete-survey" element={<ProtectedRoute component={DeleteSurvey} />} />
          <Route path="/refresh-survey" element={<ProtectedRoute component={SurveyList} />} />
          {/* add other routes */}
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
