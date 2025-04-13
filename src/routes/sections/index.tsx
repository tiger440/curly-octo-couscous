import { Navigate, useRoutes } from 'react-router-dom';
import Page404 from 'src/pages/404';
import Dashboard from 'src/pages/dashboard/Dashboard';
import EnterpriseForm from 'src/pages/enterprise-form/EnterpriseForm';
import ForgetPassword from 'src/pages/forget-password/ForgetPassword';
import Home from 'src/pages/home/Home';
import Login from 'src/pages/login/Login';
import Profile from 'src/pages/profile/Profile';
import ResetPassword from 'src/pages/reset-password/ResetPassword';
import Result from 'src/pages/result/Result';
import Signup from 'src/pages/signup/Signup';
import ProtectedRoute from 'src/pages/protectedRoute/ProtectedRoute';
// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <Home />
      ),
    },
    {
      path: '/valuation',
      element: (
        <EnterpriseForm />
      ),
    },

    {
      path: 'login',
      element: (
        <Login />
      ),
    },
    {
      path: 'signup',
      element: (
        <Signup />
      ),
    },
    {
      path: 'forget-password',
      element: (
        <ForgetPassword />
      ),
    },
    {
      path: 'reset-password',
      element: (
        <ResetPassword />
      ),
    },
    {
      path: 'enterprise-form',
      element: (
        <EnterpriseForm />
      ),
    },
    {
      path: `result`,
      element: (
        <Result />
      ),
    },

    {
      path: 'dashboard',
      element: (
        <Dashboard />
      ),
    },
    {
      path: 'profile',
      element: (
        <ProtectedRoute><Profile /></ProtectedRoute>
      ),
    },


    {
      path: '404',
      element: (
        <Page404 />
      ),
    },

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
