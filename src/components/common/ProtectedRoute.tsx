/**
 * ProtectedRoute — redirects unauthenticated users to /login.
 * Wraps admin routes to enforce authentication.
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../services';

export const ProtectedRoute: React.FC = () => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
