import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
import { AuthGuard } from 'src/auth/guard';
import { LoadingScreen } from 'src/components/loading-screen';
import { DashboardLayout } from 'src/layouts/dashboard';

const IndexPage = lazy(() => import('src/pages'));
const TopMarqueePage = lazy(() => import('src/pages/top-marquee/list'));
const CategoryPage = lazy(() => import('src/pages/category/list'));
const ProductPage = lazy(() => import('src/pages/product/list'));
const InquiryPage = lazy(() => import('src/pages/inquiry/list'));

const dashboardLayout = () => (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
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
        path: '/',
        children: [{ index: true, element: <TopMarqueePage /> }],
      },
    ],
  },
  {
    path: 'dashboard',
    element: <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { index: true, element: <IndexPage /> },
      {
        path: 'top-marquee',
        children: [{ index: true, element: <TopMarqueePage /> }],
      },
      {
        path: 'category',
        children: [{ index: true, element: <CategoryPage /> }],
      },
      {
        path: 'product',
        children: [{ index: true, element: <ProductPage /> }],
      },
      {
        path: 'inquiry',
        children: [{ index: true, element: <InquiryPage /> }],
      },
    ],
  },
];
