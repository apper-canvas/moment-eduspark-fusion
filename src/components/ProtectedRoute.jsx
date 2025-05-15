import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isInitialized } = useContext(AuthContext);
  
  // Show loading state if authentication is still initializing
  if (!isInitialized) {
    return <div className="flex justify-center items-center h-64">Checking authentication...</div>;
  }
  
  // Redirect to login if not authenticated, preserving the current path for redirect after login
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }
  
  return children;
};

export default ProtectedRoute;