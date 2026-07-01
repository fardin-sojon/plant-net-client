import Home from '../pages/Home/Home'
import ErrorPage from '../pages/ErrorPage'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import PlantDetails from '../pages/PlantDetails/PlantDetails'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import AddPlant from '../pages/Dashboard/Seller/AddPlant'
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers'
import ManageMessages from '../pages/Dashboard/Admin/ManageMessages'
import Profile from '../pages/Dashboard/Common/Profile'
import Statistics from '../pages/Dashboard/Common/Statistics'
import MainLayout from '../layouts/MainLayout'
import MyInventory from '../pages/Dashboard/Seller/MyInventory'
import ManageOrders from '../pages/Dashboard/Seller/ManageOrders'
import MyOrders from '../pages/Dashboard/Customer/MyOrders'
import { createBrowserRouter } from 'react-router'
import PaymentSuccess from '../pages/PlantDetails/Payment/PaymentSuccess'
import ResetPassword from '../pages/ResetPassword/ResetPassword'
import Cart from '../pages/Cart/Cart'
import Shop from '../pages/Shop/Shop'
import AboutUs from '../pages/About/AboutUs'
import ContactUs from '../pages/Contact/ContactUs'
import FaqPage from '../pages/FAQ/FaqPage'
import PrivacyPolicy from '../pages/Legal/PrivacyPolicy'
import TermsOfService from '../pages/Legal/TermsOfService'
import ReturnPolicy from '../pages/Legal/ReturnPolicy'

import Wishlist from '../pages/Dashboard/Customer/Wishlist'
import ManageCoupons from '../pages/Dashboard/Admin/ManageCoupons'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/plant/:id',
        element: <PlantDetails />,
      },
      {
        path: '/payment-success',
        element: <PaymentSuccess/>,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/shop',
        element: <Shop />,
      },
      {
        path: '/about',
        element: <AboutUs />,
      },
      {
        path: '/contact',
        element: <ContactUs />,
      },
      {
        path: '/faqs',
        element: <FaqPage />,
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: '/terms-of-service',
        element: <TermsOfService />,
      },
      {
        path: '/return-policy',
        element: <ReturnPolicy />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
      {
        path: '/forget-password',
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Statistics />
          </PrivateRoute>
        ),
      },
      {
        path: 'add-plant',
        element: (
          <PrivateRoute>
            <AddPlant />
          </PrivateRoute>
        ),
      },
      {
        path: 'my-inventory',
        element: (
          <PrivateRoute>
            <MyInventory />
          </PrivateRoute>
        ),
      },
      {
        path: 'manage-users',
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: 'manage-messages',
        element: (
          <AdminRoute>
            <ManageMessages />
          </AdminRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: 'my-orders',
        element: (
          <PrivateRoute>
            <MyOrders />
          </PrivateRoute>
        ),
      },
      {
        path: 'manage-orders',
        element: (
          <PrivateRoute>
            <ManageOrders />
          </PrivateRoute>
        ),
      },
      {
        path: 'wishlist',
        element: (
          <PrivateRoute>
            <Wishlist />
          </PrivateRoute>
        ),
      },
      {
        path: 'manage-coupons',
        element: (
          <AdminRoute>
            <ManageCoupons />
          </AdminRoute>
        ),
      },
    ],
  },
])
