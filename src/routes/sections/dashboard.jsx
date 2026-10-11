import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard } from 'src/auth/guard';
import { LoadingScreen } from 'src/components/loading-screen';
import { DashboardLayout } from 'src/layouts/dashboard';

const MarqueePage = lazy(() => import('src/pages/marquee'));
const DashboardPage = lazy(() => import('src/pages/dashboard'));

const dashboardLayout = () => (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen message="Loading SkyTech CMS..." />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: '/',
    element: <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      {
        path: 'marquee',
        element: <MarqueePage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
    ],
  },
];
