import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardSkeleton } from '../admin/AdminSkeleton';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <DashboardSkeleton />;
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
