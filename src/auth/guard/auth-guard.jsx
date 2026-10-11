import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from 'src/services/api-service';
import { paths } from 'src/routes/paths';
import { SplashScreen } from 'src/components/loading-screen';

export function AuthGuard({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = apiService.isAuthenticated();
    if (!isAuth) {
      const queryString = new URLSearchParams({ returnTo: location.pathname }).toString();
      navigate(`${paths.auth.login}?${queryString}`, { replace: true });
    } else {
      setIsChecking(false);
    }
  }, [location.pathname, navigate]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

export default AuthGuard;
