import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";

import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem,
} from "@/components/ui/select";

import Loader from "@/components/common/Loader";
import { toast } from "sonner";

//  LUCIDE ICONS
import { Check, CheckCheck, X } from "lucide-react";

// TOOLTIP
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

// CANCEL CONFIRMATION DIALOG
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

export default function HospitalAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search + Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination
  const isMobile = window.innerWidth < 768;
  const itemsPerPage = isMobile ? 5 : 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Cancel confirmation
  const [cancelId, setCancelId] = useState(null);

  // Load appointments
  async function load() {
    try {
      const res = await api.get("/hospital/appointments");
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Error loading appointments:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Update Status
  async function updateStatus(id, status) {
    try {
      await api.put(`/hospital/appointments/${id}/status`, { status });
      toast.success(`Status changed to ${status}`);
      load();
    } catch (err) {
      toast.error("Failed to update appointment");
    }
  }

  if (loading)
    return (
      <div className="w-full flex justify-center mt-20">
        <Loader size={60} />
      </div>
    );

  // ---------------- SORTING: Pending → Approved → Completed → Cancelled ----------------
  const sorted = [...appointments].sort((a, b) => {
    const order = { Pending: 1, Approved: 2, Completed: 3, Cancelled: 4 };

    if (order[a.status] !== order[b.status]) {
      return order[a.status] - order[b.status];
    }

    // newest first
    return new Date(b.date) - new Date(a.date);
  });

  // ---------------- FILTER + SEARCH ----------------
  const filtered = sorted.filter((a) => {
    const s = search.toLowerCase();

    const matchText =
      a.donor?.name?.toLowerCase().includes(s) ||
      a.type?.toLowerCase().includes(s) ||
      new Date(a.date).toLocaleDateString().includes(s);

    const matchStatus =
      statusFilter === "All" || a.status === statusFilter;

    return matchText && matchStatus;
  });

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const first = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(first, first + itemsPerPage);

  return (
    <div className="w-full space-y-6 mt-4 pb-10">

      {/* HEADER */}
      <header className="py-4 text-center">
        <h1 className="text-3xl font-semibold text-red-600 dark:text-red-400">
          Donor Appointments
        </h1>
      </header>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">

        <Input
          placeholder="Search donor, type, or date..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="md:w-1/3"
        />

        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="md:w-48 w-full">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {/* ---------------- DESKTOP TABLE ---------------- */}
      <div className="hidden md:block px-2">
        <Table>
          <TableCaption>Appointments placed with your hospital</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Donor</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No matching records.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((a) => (
                <TableRow key={a._id}>
                  <TableCell>{a.donor?.name || "Unknown"}</TableCell>
                  <TableCell>{a.type}</TableCell>
                  <TableCell>{new Date(a.date).toLocaleDateString()}</TableCell>
                  <TableCell className="capitalize">{a.status}</TableCell>

                  {/* ICON ACTIONS (DESKTOP) */}
                  <TableCell>
                    <div className="flex items-center gap-6">

                      {/* APPROVE */}
                      {a.status === "Pending" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Check
                                size={24}
                                className="text-green-600 cursor-pointer hover:scale-125 transition"
                                onClick={() => updateStatus(a._id, "Approved")}
                              />
                            </TooltipTrigger>
                            <TooltipContent>Approve</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {/* COMPLETE */}
                      {a.status === "Approved" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <CheckCheck
                                size={24}
                                className="text-blue-600 cursor-pointer hover:scale-125 transition"
                                onClick={() => updateStatus(a._id, "Completed")}
                              />
                            </TooltipTrigger>
                            <TooltipContent>Mark Completed</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {/* CANCEL WITH FIXED CONFIRMATION POPUP */}
                      {a.status !== "Completed" && a.status !== "Cancelled" && (
                        <AlertDialog>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="cursor-pointer"
                                  onClick={() => setCancelId(a._id)}
                                >
                                  <AlertDialogTrigger asChild>
                                    <X
                                      size={24}
                                      className="text-red-600 hover:scale-125 transition"
                                    />
                                  </AlertDialogTrigger>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>Cancel</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel this appointment?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The appointment will be permanently marked as cancelled.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>No</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={() => {
                                  updateStatus(cancelId, "Cancelled");
                                  setCancelId(null);
                                }}
                              >
                                Yes, Cancel
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>

                        </AlertDialog>
                      )}

                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </div>

      {/* ---------------- MOBILE CARDS ---------------- */}
      <div className="md:hidden px-2 space-y-4">
        {currentItems.map((a) => (
          <Card key={a._id} className="p-4 shadow-sm border space-y-2">

            <p className="text-lg font-semibold text-red-600">
              {a.donor?.name || "Unknown Donor"}
            </p>

            <p><strong>Type:</strong> {a.type}</p>
            <p><strong>Date:</strong> {new Date(a.date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span className="capitalize">{a.status}</span></p>

            {/* ICON ACTIONS (MOBILE) */}
            <div className="flex items-center gap-8 mt-4">

              {/* APPROVE */}
              {a.status === "Pending" && (
                <Check
                  size={28}
                  className="text-green-600 cursor-pointer hover:scale-125 transition"
                  onClick={() => updateStatus(a._id, "Approved")}
                />
              )}

              {/* COMPLETE */}
              {a.status === "Approved" && (
                <CheckCheck
                  size={28}
                  className="text-blue-600 cursor-pointer hover:scale-125 transition"
                  onClick={() => updateStatus(a._id, "Completed")}
                />
              )}

              {/* CANCEL WITH CONFIRMATION */}
              {a.status !== "Completed" && a.status !== "Cancelled" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <X
                      size={28}
                      className="text-red-600 cursor-pointer hover:scale-125 transition"
                      onClick={() => setCancelId(a._id)}
                    />
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel this appointment?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. Cancelling will permanently mark this appointment as cancelled.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>No</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={() => {
                          updateStatus(cancelId, "Cancelled");
                          setCancelId(null);
                        }}
                      >
                        Yes, Cancel
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>

                </AlertDialog>
              )}

            </div>

          </Card>
        ))}
      </div>

      {/* ---------------- PAGINATION ---------------- */}
      {filtered.length > 0 && (
        <div className="flex justify-center mt-4 gap-2">

          <button
            className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          <span className="px-4 py-2 text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}
