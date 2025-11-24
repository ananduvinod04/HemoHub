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
      
      ]
    }
  ]
}

,

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
