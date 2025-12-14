import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HistoryTable from "./DonationHistoryTable";
import { useAuthStore } from "@/store/authStore";
import Loader from "@/components/common/Loader";
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(true); // 🔥 NEW
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

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

        // 🔥 Redirect on auth failure
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false); // 🔥 ALWAYS stop loader
      }
    }
    loadData();
  }, [navigate]);

  // ✅ Proper loading check
  if (loading) return <Loader size={64} className="mt-20" />;

  // ✅ If no dashboard after loading → auth issue
  if (!dashboard) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Unable to load dashboard. Please login again.
      </p>
    );
  }

  // Pagination calculation
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = history.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(history.length / itemsPerPage);

  const { totalAppointments, eligibilityStatus, lastDonationDate } = dashboard;

  return (
    <div className="space-y-10 py-4">

      {/* HEADER */}
      <header className="py-2 text-center mt-2 mb-1">
        <h1 className="text-3xl font-semibold text-red-600 dark:text-red-400">
          Donor Dashboard
        </h1>

        <p className="text-base text-gray-700 dark:text-gray-300 mt-1">
          Welcome, <span className="font-semibold">{user?.name}</span> 👋
        </p>
      </header>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle>Your Appointment Summary</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-4xl font-bold text-red-600">
              {totalAppointments}
            </p>
            <p className="text-gray-600">Total Appointments</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle>Donation Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
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

            <p className="text-sm mt-2">
              Last Donation:{" "}
              {lastDonationDate
                ? new Date(lastDonationDate).toLocaleDateString()
                : "No previous donation"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* HISTORY */}
      <div className="px-2">
        <div className="hidden md:block">
          <HistoryTable history={currentItems} />
        </div>

        <div className="md:hidden space-y-4">
          {currentItems.length === 0 ? (
            <p className="text-center text-gray-500">No history found.</p>
          ) : (
            currentItems.map((item) => (
              <Card key={item._id} className="p-4 border shadow-sm">
                <p className="font-semibold text-red-600">{item.type}</p>
                <p>Hospital: {item.hospitalName}</p>
                <p>Date: {new Date(item.date).toLocaleDateString()}</p>
                <p>Status: {item.status}</p>
              </Card>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
