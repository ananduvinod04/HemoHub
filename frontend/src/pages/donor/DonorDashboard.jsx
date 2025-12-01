import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HistoryTable from "./DonationHistoryTable";
import { useAuthStore } from "@/store/authStore";
import Loader from "@/components/common/Loader";

// Pagination components
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";

export default function DonorDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [history, setHistory] = useState([]);
  const user = useAuthStore((state) => state.user);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function loadData() {
      try {
        const dash = await api.get("/donor/dashboard");
        setDashboard(dash.data);

        const h = await api.get("/donor/appointments/history");
        setHistory(h.data.appointments || []);
      } catch (err) {
        console.log("Dashboard Error:", err);
      }
    }
    loadData();
  }, []);

  if (!dashboard) return <Loader size={64} className="mt-20" />;

  // Pagination calculation
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = history.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(history.length / itemsPerPage);

  const { totalAppointments, eligibilityStatus, lastDonationDate } = dashboard;

  return (
    <div className="space-y-10 py-4">

      {/* ---------------- Header Section (Responsive Username) ---------------- */}
      <header className="px-4 py-8 bg-white dark:bg-gray-900 shadow-sm rounded-lg">

        <div className="flex items-center justify-between md:flex-row flex-col md:space-y-0 space-y-2">

          {/* Dashboard Heading */}
          <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">
            Dashboard
          </h2>

          {/* Username → Right on desktop, below heading on mobile */}
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-100 md:text-right text-center w-full md:w-auto">
            Welcome, {user?.name}
          </p>

        </div>

      </header>

      {/* ---------------- Dashboard Tiles ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">

        {/* TILE 1 */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Your Appointment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-red-600">
                {totalAppointments}
              </p>
              <p className="text-gray-600">Total Appointments</p>
            </div>
          </CardContent>
        </Card>

        {/* TILE 2 */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Donation Eligibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <p
                className={`text-3xl font-bold ${
                  eligibilityStatus === "Eligible"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {eligibilityStatus}
              </p>
              <p className="text-gray-600">Current Status</p>
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-sm">Last Donation Date</p>
              <p className="font-medium">
                {lastDonationDate
                  ? new Date(lastDonationDate).toLocaleDateString()
                  : "No previous donation"}
              </p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ---------------- History Section ---------------- */}
      <div className="px-2">

        {/* Desktop Table */}
        <div className="hidden md:block">
          <HistoryTable history={currentItems} />
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {currentItems.length === 0 ? (
            <p className="text-center text-gray-500">No history found.</p>
          ) : (
            currentItems.map((item) => (
              <Card key={item._id} className="border shadow-sm p-4">
                <div className="flex flex-col gap-2">

                  <p className="text-base font-semibold text-red-600">
                    {item.type}
                  </p>

                  <p className="text-sm">
                    <span className="font-semibold">Hospital:</span> {item.hospitalName}
                  </p>

                  <p className="text-sm">
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(item.date).toLocaleDateString()}
                  </p>

                  <p className="text-sm">
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={`${
                        item.status === "Approved"
                          ? "text-green-600"
                          : item.status === "Pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </p>

                </div>
              </Card>
            ))
          )}
        </div>

        {/* ---------------- Pagination ---------------- */}
        {history.length > 0 && (
          <Pagination className="mt-4">
            <PaginationContent>

              {/* Prev Button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

            </PaginationContent>
          </Pagination>
        )}

      </div>

    </div>
  );
}
