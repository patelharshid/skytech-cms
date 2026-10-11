import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from 'src/services/api-service';
import { CONFIG } from 'src/global-config';
import { SplashScreen } from 'src/components/loading-screen';

export function GuestGuard({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = apiService.isAuthenticated();
    if (isAuth) {
      const searchParams = new URLSearchParams(location.search);
      const returnTo = searchParams.get('returnTo');
      const target = returnTo ? returnTo : CONFIG.auth.redirectPath;
      navigate(target, { replace: true });
    } else {
      setIsChecking(false);
    }
  }, [location.search, navigate]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

export default GuestGuard;
