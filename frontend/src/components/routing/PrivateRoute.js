import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" />;
  }
  
  // If children is a function, pass the user object to it
  if (typeof children === 'function') {
    return children({ user });
  }

  return children;
};

export default PrivateRoute;
