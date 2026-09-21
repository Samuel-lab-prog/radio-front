import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@core/components/Layout';
import { AdminLoginPage, RequireRole } from '@features/auth/public';
import {
  AdminNewsPage,
  NewsDetailsPage,
  NewsListPage,
} from '@features/news/public';
import { HomePage } from '@features/home/public';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/news', element: <NewsListPage /> },
      { path: '/news/:slug', element: <NewsDetailsPage /> },
      { path: '/admin/login', element: <AdminLoginPage /> },
      {
        element: <RequireRole role="admin" />,
        children: [{ path: '/admin/news', element: <AdminNewsPage /> }],
      },
    ],
  },
]);
