import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Welcome from "./pages/Welcome";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import "./index.css";

import DonorLayout from "./pages/donor/DonorLayout";

import ProtectedRoute from "./pages/auth/ProtectedRoute";
import DonorDashboard from "./pages/donor/DonorDashboard";
import DonorProfile from "./pages/donor/DonorProfile";
import DonorBookAppointment from "./pages/donor/DonorBookAppointment";
import DonorAppointmentHistory from "./pages/donor/DonorAppointmentHistory";
import RecipientDashboard from "./pages/recipient/RecipientDashboard";

import RecipientProfile from "./pages/recipient/RecipientProfile";
import RecipientLayout from "./pages/recipient/RecipientLayout";
import RecipientCreateRequest from "./pages/recipient/RecipientCreateRequest";
import RecipientRequests from "./pages/recipient/RecipientRequests";
import RecipientBloodStock from "./pages/recipient/RecipientBloodStock";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Welcome /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
    ],
  },
  {
    path: "/donor",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <DonorLayout />,
        children: [
          { index: true, element: <DonorDashboard /> },
          { path: "dashboard", element: <DonorDashboard /> },
          { path: "profile", element: <DonorProfile /> },
          { path: "book-appointment", element: <DonorBookAppointment /> },
          { path: "appointments", element: <DonorAppointmentHistory /> },
        ],
      },
    ],
  },


// {
//   path: "/recipient",
//   element: <RecipientLayout />,
//   children: [
//     { index: true, element: <RecipientDashboard/> },
//     { path: "request-blood", element: <RequestBlood /> },
//     { path: "emergency", element: <EmergencyRequest/> },
//     { path: "history", element: <RecipientHistory/> },
//     { path: "profile", element: <RecipientProfile /> },
//   ],
// }
{
  path: "/recipient",
  element: <ProtectedRoute />,   // protects all recipient routes
  children: [
    {
      path: "",
      element: <RecipientLayout />,
      children: [
        { index: true, element: <RecipientDashboard /> },
        { path: "dashboard", element: <RecipientDashboard /> },
        { path: "profile", element: <RecipientProfile /> },
        { path: "request-blood", element: <RecipientCreateRequest /> },
        { path: "requests", element: <RecipientRequests /> },
        { path: "blood-stock", element: <RecipientBloodStock/> },
      ],
    },
  ],
}





]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
