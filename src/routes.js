import { Navigate, useRoutes } from 'react-router-dom';
import React, { Suspense } from 'react'
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import CheckAuth from './helpers/checkAuth';
import Spinner from './layouts/Spinner';
//
import { useSelector } from 'react-redux';
const Login = React.lazy(() => import('./pages/Login'));

const Register = React.lazy(() => import('./pages/Register'));

const DashboardApp = React.lazy(() => import('./pages/DashboardApp'));


const Products = React.lazy(() => import('./pages/Products'));

const Blog = React.lazy(() => import('./pages/Blog'));

const NotFound = React.lazy(() => import('./pages/Page404'));

const Profile = React.lazy(() => import('./pages/Profile'));
const Vendors = React.lazy(() => import('./pages/Vendors/Vendors'));
const Vendor = React.lazy(() => import('./pages/Vendors/Vendor'));
const Users = React.lazy(() => import('./pages/Users/Users'));
const User = React.lazy(() => import('./pages/Users/User'));



// ----------------------------------------------------------------------

export default function Router() {
  const checkAuth = useSelector((state) => state.auth)

  let redir = checkAuth === null ? false : true;
  // checking admin;
  return useRoutes([
    {
      path: '/login',
      element: redir ? <Navigate to={"/dashboard/app"} /> : <Suspense fallback={<Spinner />}> <Login />  </Suspense>
    },
    {
      path: '/dashboard',
      element: redir ? <Navigate to={"/dashboard/app"} /> : <Suspense fallback={<Spinner />}> <Login />  </Suspense>
    },
    {
      path: '/dashboard',
      element: redir ? <DashboardLayout /> : <Navigate to={"/login"} />,
      children: [
        { path: 'app', element: <Suspense fallback={<Spinner />}><DashboardApp /></Suspense> },
        { path: 'vendors', element: <Suspense fallback={<Spinner />}> <Vendors /></Suspense> },
        { path: 'vendor/:id', element: <Suspense fallback={<Spinner />}> <Vendor /></Suspense> },
        { path: "profile", element: <Suspense fallback={<Spinner />}> <Profile /> </Suspense> },
        { path: 'users', element: <Suspense fallback={<Spinner />}><Users /> </Suspense> },
        { path: 'user/:id', element: <Suspense fallback={<Spinner />}> <User /> </Suspense> },
        { path: 'products', element: <Suspense fallback={<Spinner />}> <Products /> </Suspense> },
        { path: 'blog', element: <Suspense fallback={<Spinner />}> <Blog /></Suspense> }
      ]
    },
    {
      path: '/',
      element: redir ? <LogoOnlyLayout /> : <Navigate to={"/login"} />,

      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: 'login', element: <Suspense fallback={<Spinner />}> <Login />  </Suspense> },
        { path: 'register', element: <Suspense fallback={<Spinner />}> <Register /> </Suspense> },
        { path: '404', element: <Suspense fallback={<Spinner />}><NotFound /></Suspense> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
