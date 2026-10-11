import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { GuestGuard } from 'src/auth/guard';
import { SplashScreen } from 'src/components/loading-screen';

const LoginPage = lazy(() => import('src/pages/auth/login'));

export const authRoutes = [
  {
    path: 'login',
    element: (
      <GuestGuard>
        <Suspense fallback={<SplashScreen />}>
          <LoginPage />
        </Suspense>
      </GuestGuard>
    ),
  },
  {
    path: 'auth',
    element: (
      <GuestGuard>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </GuestGuard>
    ),
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
];
