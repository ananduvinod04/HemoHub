import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
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
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Loader from "@/components/common/Loader";

/* ===============================
   Helpers
================================ */
const normalizeStatus = (s) => s?.toLowerCase();

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/* ===============================
   Sorting: active first, final last
================================ */
function sortRequests(list) {
  const priority = {
    pending: 1,
    approved: 2,
    fulfilled: 3,
    rejected: 4,
  };

  return [...list].sort((a, b) => {
    const sa = normalizeStatus(a.status);
    const sb = normalizeStatus(b.status);

    if (priority[sa] !== priority[sb]) {
      return priority[sa] - priority[sb];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

export default function AdminManageRequests() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [hospitalFilter, setHospitalFilter] = useState("All");

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  /* ===============================
     Responsive pagination
  =============================== */
  useEffect(() => {
    const resize = () =>
      setItemsPerPage(window.innerWidth < 768 ? 5 : 10);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ===============================
     Fetch hospitals
  =============================== */
  async function getHospitals() {
    const res = await api.get("/recipient/hospitals");
    setHospitals(res.data || []);
  }

  /* ===============================
     Fetch requests
  =============================== */
  async function fetchRequests() {
    try {
      const res = await api.get("/admin/requests");
      const sorted = sortRequests(res.data.data || []);
      setRequests(sorted);
      setFiltered(sorted);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
    getHospitals();
  }, []);

  /* ===============================
     Filters
  =============================== */
  useEffect(() => {
    let list = [...requests];

    if (search.trim()) {
      list = list.filter(r =>
        r.recipient?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      list = list.filter(
        r => normalizeStatus(r.status) === normalizeStatus(statusFilter)
      );
    }

    if (hospitalFilter !== "All") {
      list = list.filter(
        r => r.hospital?.hospitalName === hospitalFilter
      );
    }

    setPage(1);
    setFiltered(sortRequests(list));
  }, [search, statusFilter, hospitalFilter, requests]);

  /* ===============================
     Pagination
  =============================== */
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  /* ===============================
     Actions
  =============================== */
  async function updateStatus(id, status) {
    if (updatingId) return;
    setUpdatingId(id);
    await api.put(`/admin/requests/${id}/status`, { status });
    await fetchRequests();
    setUpdatingId(null);
  }

  async function deleteRequest(id) {
    if (updatingId) return;
    setUpdatingId(id);
    await api.delete(`/admin/requests/${id}`);
    await fetchRequests();
    setDeleteId(null);
    setUpdatingId(null);
  }

  if (loading) return <Loader className="h-12 w-12" />;

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">
            Manage Blood Requests
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              placeholder="Search recipient name..."
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
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Fulfilled">Fulfilled</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Hospital" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Hospitals</SelectItem>
              {hospitals.map(h => (
                <SelectItem key={h._id} value={h.hospitalName}>
                  {h.hospitalName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {paginatedData.map(r => {
          const status = normalizeStatus(r.status);

          return (
            <Card key={r._id}>
              <CardContent className="space-y-1 pt-4">
                <div className="text-sm">{formatDate(r.createdAt)}</div>
                <div className="font-semibold">{r.recipient?.name}</div>
                <div className="text-sm capitalize">Status: {status}</div>

                <div className="flex gap-4 pt-2">
                  {(status === "pending" ||
                    status === "fulfilled" ||
                    status === "rejected") && (
                    <CheckCircle
                      className="text-green-600 cursor-pointer"
                      onClick={() => updateStatus(r._id, "Approved")}
                    />
                  )}

                  {status === "pending" && (
                    <XCircle
                      className="text-red-600 cursor-pointer"
                      onClick={() => updateStatus(r._id, "Rejected")}
                    />
                  )}

                  {status === "approved" && (
                    <ClipboardCheck
                      className="text-blue-600 cursor-pointer"
                      onClick={() => updateStatus(r._id, "Fulfilled")}
                    />
                  )}

                  <Trash2
                    className="text-red-500 cursor-pointer"
                    onClick={() => setDeleteId(r._id)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block">
        <Card>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Recipient</th>
                  <th className="p-3 text-left">Hospital</th>
                  <th className="p-3 text-left">Blood</th>
                  <th className="p-3 text-left">Qty</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map(r => {
                  const status = normalizeStatus(r.status);

                  return (
                    <tr key={r._id} className="border-b">
                      <td className="p-3">{formatDate(r.createdAt)}</td>
                      <td className="p-3">{r.recipient?.name}</td>
                      <td className="p-3">{r.hospital?.hospitalName}</td>
                      <td className="p-3">{r.bloodGroup}</td>
                      <td className="p-3">{r.quantity}</td>
                      <td className="p-3 capitalize">{status}</td>

                      <td className="p-3 flex gap-3">
                        {(status === "pending" ||
                          status === "fulfilled" ||
                          status === "rejected") && (
                          <CheckCircle
                            className="text-green-600 cursor-pointer"
                            onClick={() =>
                              updateStatus(r._id, "Approved")
                            }
                          />
                        )}

                        {status === "pending" && (
                          <XCircle
                            className="text-red-600 cursor-pointer"
                            onClick={() =>
                              updateStatus(r._id, "Rejected")
                            }
                          />
                        )}

                        {status === "approved" && (
                          <ClipboardCheck
                            className="text-blue-600 cursor-pointer"
                            onClick={() =>
                              updateStatus(r._id, "Fulfilled")
                            }
                          />
                        )}

                        <Trash2
                          className="text-red-500 cursor-pointer"
                          onClick={() => setDeleteId(r._id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* ================= DELETE CONFIRM ================= */}
      <AlertDialog open={!!deleteId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Request?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600"
              onClick={() => deleteRequest(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <ChevronLeft
            className={`cursor-pointer ${
              page === 1 && "opacity-40 pointer-events-none"
            }`}
            onClick={() => setPage(p => p - 1)}
          />
          <span className="text-sm">
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
