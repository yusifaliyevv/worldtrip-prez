import { createBrowserRouter } from "react-router-dom";
import Layout from "../src/components/layout/Layout";

import Home from "./pages/Home/Home";
import Travels from "./pages/Travels/Travels";
import TravelDetail from "./pages/TravelDetail/TravelDetail";
import Bookings from "./pages/Bookings/Bookings";
import BookingDetail from "./pages/BookingDetail/BookingDetail";

// Admin 
import AdminPanelPage from "./pages/AdminPanel/AdminPanelPage";
import TravelCreate from "./components/admin/TravelCreate";
import UsersTable from "./components/admin/UsersTable";
import TravelList from "./components/admin/TravelList";
import BookingList from "./components/admin/BookingList";
import DashboardStats from "./components/admin/DashboardStats";

// Auth 
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

// NotFound 
import NotFound from "./pages/NotFound/NotFound";

// Ai Assistant
import AiAssistant from "./pages/AiAssistant/AiAssistant";

// ProtectedRoute AdminRoute
import ProtectedRoute from "./components/protected/ProtectedRoute";
import AdminRoute from "./components/protected/AdminRoute";
import SuccessPage from "./pages/Success/SuccessPage";
import Settings from "./pages/Profile/UpdateProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/travels", element: <Travels /> },
      { path: "/travel/:id", element: <TravelDetail /> },
      {
        path: "/bookings",
        element: (
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/booking/:id",
        element: (
          <ProtectedRoute>
            <BookingDetail />
          </ProtectedRoute>
        ),
      },

      {
        path: "/admin",
        element: (
          <AdminRoute>
            <AdminPanelPage />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/travels",
        element: (
          <AdminRoute>
            <TravelList />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/create-travel",
        element: (
          <AdminRoute>
            <TravelCreate />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <AdminRoute>
            <UsersTable />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/bookings",
        element: (
          <AdminRoute>
            <BookingList />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/dashboard",
        element: (
          <AdminRoute>
            <DashboardStats />
          </AdminRoute>
        ),
      },
      {
        path: "/updateprofile",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },

      {
        path: "/ai",
        element: <AiAssistant />,
      },
    ],
  },
  {
    path: "/success",
    element: (
      <ProtectedRoute>
        <SuccessPage />
      </ProtectedRoute>
    ),
  },
  { path: "/forgotpassword", element: <ForgotPassword /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/resetpassword", element: <ResetPassword /> },
        { path: "*", element: <NotFound /> },
]);

export default router;
