import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthLoading, selectIsAuthenticated, selectUserRole } from '../store/authSlice';

const ProtectedRoute = ({ children, requireRole }) => {
  const loading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireRole && role !== requireRole) {
    const redirectPath = role === 'manager' ? '/manager/dashboard' : '/employee/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
