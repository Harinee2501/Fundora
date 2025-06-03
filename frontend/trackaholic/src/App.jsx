import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import ProjectDashboard from './pages/Dashboard/ProjectDashboard';
import AddProject from "./pages/Project/AddProject";
import ProjectList from "./pages/Project/ProjectList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/dashboard/:projectId" element={<ProjectDashboard />} />
        <Route path="/projects/add" element={<AddProject />} />
        <Route path="/projects" element={<ProjectList />} />
      </Routes>
    </Router>
  );
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? (
    <Navigate to="/login" />
  ) : (
    <Navigate to="/login" />
  );
};
