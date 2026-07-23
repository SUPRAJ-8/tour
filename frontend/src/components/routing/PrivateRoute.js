import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardSkeleton } from '../admin/AdminSkeleton';

const PrivateRoute = ({ children, redirectTo = '/admin' }) => {
  const { isAuthenticated, loading, user, token } = useAuth();

  if (loading) {
    return <DashboardSkeleton />;
  }

  // A token exists but the user profile hasn't been fetched into context yet
  // (e.g. right after login, before GET /auth/me resolves) — keep showing the
  // skeleton instead of bouncing back to the login page.
  if (token && !user) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }
  
  // If children is a function, pass the user object to it
  if (typeof children === 'function') {
    return children({ user });
  }

  return children;
};

export default PrivateRoute;
