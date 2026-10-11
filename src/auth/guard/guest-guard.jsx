import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiService } from 'src/services/api-service';
import { CONFIG } from 'src/global-config';

export function GuestGuard({ children }) {
  const location = useLocation();

  if (apiService.isAuthenticated()) {
    const searchParams = new URLSearchParams(location.search);
    const returnTo = searchParams.get('returnTo');
    const target = returnTo || CONFIG.auth.redirectPath;
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
}

export default GuestGuard;
