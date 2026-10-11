import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { CONFIG } from 'src/global-config';
import { SplashScreen } from 'src/components/loading-screen';

import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';

const Page404 = lazy(() => import('src/pages/error/404'));

export const routesSection = [
  {
    path: '/',
    element: <Navigate to={CONFIG.auth.redirectPath} replace />,
  },

  // Auth routes
  ...authRoutes,

  // Dashboard CMS routes
  ...dashboardRoutes,

  // 404 Catch-all
  {
    path: '*',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Page404 />
      </Suspense>
    ),
  },
];
