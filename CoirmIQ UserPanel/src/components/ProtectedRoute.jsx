import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('antigravity_user_token');
  const location = useLocation();

  if (!token) {
    // Save the location they wanted to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
