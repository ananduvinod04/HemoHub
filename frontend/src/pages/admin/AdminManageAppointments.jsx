import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import {
  Search,
  CheckCircle,
  XCircle,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Loader from "@/components/common/Loader";

/* ===============================
   Normalize backend status
================================ */
function normalizeStatus(status) {
  return status?.toLowerCase();
}

export default function AdminManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [cancelId, setCancelId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  /* ===============================
     Responsive items per page
  =============================== */
  useEffect(() => {
    const resize = () => setItemsPerPage(window.innerWidth < 768 ? 5 : 10);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ===============================
     Sorting: active first, completed last
  =============================== */
  function sortAppointments(list) {
    const priority = {
      pending: 1,
      approved: 2,
      completed: 3,
      cancelled: 4,
    };

    return [...list].sort((a, b) => {
      const sa = normalizeStatus(a.status);
      const sb = normalizeStatus(b.status);

      if (priority[sa] !== priority[sb]) {
        return priority[sa] - priority[sb];
      }

      return new Date(b.date) - new Date(a.date);
    });
  }

  /* ===============================
     Fetch appointments
  =============================== */
  async function fetchAppointments() {
    try {
      const res = await api.get("/admin/appointments");
      const sorted = sortAppointments(res.data.data || []);
      setAppointments(sorted);
      setFiltered(sorted);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  /* ===============================
     Filters
  =============================== */
  useEffect(() => {
    let list = [...appointments];

    if (search.trim()) {
      list = list.filter(a =>
        a.donor?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      list = list.filter(
        a => normalizeStatus(a.status) === normalizeStatus(statusFilter)
      );
    }

    setFiltered(sortAppointments(list));
    setPage(1);
  }, [search, statusFilter, appointments]);

  /* ===============================
     Pagination
  =============================== */
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  /* ===============================
     Date validation
  =============================== */
  function canCompleteAppointment(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);

    return appointmentDate <= today;
  }

  /* ===============================
     Update status
  =============================== */
  async function updateStatus(id, status, appointmentDate) {
    if (updatingId) return;

    if (
      normalizeStatus(status) === "completed" &&
      !canCompleteAppointment(appointmentDate)
    ) {
      toast.error("Cannot complete appointment before its scheduled date");
      return;
    }

    setUpdatingId(id);
    try {
      await api.put(`/admin/appointment/${id}`, { status });
      toast.success(`Appointment marked as ${status}`);
      fetchAppointments();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update appointment"
      );
    } finally {
      setUpdatingId(null);
      setCancelId(null);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">
            Manage Donor Appointments
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              placeholder="Search donor name..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden space-y-4">
        {paginatedData.map(a => {
          const status = normalizeStatus(a.status);

          return (
            <Card key={a._id}>
              <CardContent className="pt-4 space-y-1">
                <div className="font-semibold">{a.donor?.name}</div>
                <div className="text-sm">Blood: {a.donor?.bloodGroup}</div>
                <div className="text-sm">Hospital: {a.hospitalName}</div>
                <div className="text-sm">
                  Date: {new Date(a.date).toLocaleDateString()}
                </div>
                <div className="text-sm capitalize">Status: {status}</div>

                <div className="flex gap-4 pt-2">
                  {status === "pending" && (
                    <>
                      <CheckCircle
                        className="text-green-600 cursor-pointer"
                        onClick={() =>
                          updateStatus(a._id, "Approved", a.date)
                        }
                      />

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <XCircle
                            className="text-red-600 cursor-pointer"
                            onClick={() => setCancelId(a._id)}
                          />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Cancel Appointment?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>No</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600"
                              onClick={() =>
                                updateStatus(cancelId, "Cancelled", a.date)
                              }
                            >
                              Yes, Cancel
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}

                  {status === "approved" && (
                    <ClipboardCheck
                      className="text-blue-600 cursor-pointer"
                      onClick={() =>
                        updateStatus(a._id, "Completed", a.date)
                      }
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block">
        <Card>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Donor</th>
                  <th className="p-3 text-left">Blood</th>
                  <th className="p-3 text-left">Hospital</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map(a => {
                  const status = normalizeStatus(a.status);

                  return (
                    <tr key={a._id} className="border-b">
                      <td className="p-3">{a.donor?.name}</td>
                      <td className="p-3">{a.donor?.bloodGroup}</td>
                      <td className="p-3">{a.hospitalName}</td>
                      <td className="p-3">{a.type}</td>
                      <td className="p-3">
                        {new Date(a.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 capitalize">{status}</td>

                      <td className="p-3 flex gap-3">
                        {status === "pending" && (
                          <>
                            <CheckCircle
                              className="text-green-600 cursor-pointer"
                              onClick={() =>
                                updateStatus(a._id, "Approved", a.date)
                              }
                            />

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <XCircle
                                  className="text-red-600 cursor-pointer"
                                  onClick={() => setCancelId(a._id)}
                                />
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Cancel Appointment?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>No</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600"
                                    onClick={() =>
                                      updateStatus(cancelId, "Cancelled", a.date)
                                    }
                                  >
                                    Yes, Cancel
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}

                        {status === "approved" && (
                          <ClipboardCheck
                            className="text-blue-600 cursor-pointer"
                            onClick={() =>
                              updateStatus(a._id, "Completed", a.date)
                            }
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <ChevronLeft
            className={`cursor-pointer ${
              page === 1 && "opacity-40 pointer-events-none"
            }`}
            onClick={() => setPage(p => p - 1)}
          />
          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          <ChevronRight
            className={`cursor-pointer ${
              page === totalPages && "opacity-40 pointer-events-none"
            }`}
            onClick={() => setPage(p => p + 1)}
          />
        </div>
      )}
    </div>
  );
}
