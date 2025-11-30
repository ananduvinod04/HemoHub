import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Welcome from "./pages/Welcome";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import "./index.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider"
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



import HospitalLayout from "./pages/hospital/HospitalLayout";
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import HospitalProfile from "./pages/hospital/HospitalProfile";
import AddBloodStock from "./pages/hospital/AddBloodStock";
import HospitalManageStock from "./pages/hospital/HospitalManageStock";
import HospitalAppointments from "./pages/hospital/HospitalAppointments";
import HospitalRecipientRequests from "./pages/hospital/HospitalRecipientRequests";



import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminManageUsers from "@/pages/admin/AdminManageUsers";
import AdminManageBloodStock from "@/pages/admin/AdminManageBloodStock";
import AdminManageRequests from "@/pages/admin/AdminManageRequests";
import AdminManageAppointments from "@/pages/admin/AdminManageAppointments";
import AdminDeleteLogs from "@/pages/admin/AdminDeleteLogs";

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
,



{
  path: "/hospital",
  element: <ProtectedRoute />,
  children: [
    {
      path: "",
      element: <HospitalLayout />,
      children: [
        { index: true, element: <HospitalDashboard /> },
        { path: "dashboard", element: <HospitalDashboard/> },
        { path: "profile", element: <HospitalProfile /> },
        { path: "add-stock", element: <AddBloodStock /> },
        { path: "manage-stock", element: <HospitalManageStock /> },
        { path: "appointments", element: <HospitalAppointments /> },
        { path: "requests", element: <HospitalRecipientRequests/> },
      ],
    },
  ],
},

{
  path: "/admin",
  element: <ProtectedRoute />,
  children: [
    {
      path: "",
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "users", element: <AdminManageUsers /> },
        { path: "stocks", element: <AdminManageBloodStock /> },
        { path: "requests", element: <AdminManageRequests /> },
        { path: "appointments", element: <AdminManageAppointments /> },
        { path: "delete-logs", element: <AdminDeleteLogs /> },
      ],
    },
  ],
}





]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
  <RouterProvider router={router} />
  </ThemeProvider>
     <Toaster richColors position="top-center" />
  </>
  
);
