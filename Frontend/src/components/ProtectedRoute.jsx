import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../api/authService.js';

export const ProtectedRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
