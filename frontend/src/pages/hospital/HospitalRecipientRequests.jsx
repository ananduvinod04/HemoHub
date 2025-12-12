import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import Loader from "@/components/common/Loader";

// Icons + Tooltips
import { Check, X, CheckCheck, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

// Details Modal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Reject Confirmation Modal
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function HospitalRecipientRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [requestTypeFilter, setRequestTypeFilter] = useState("All");

  // Pagination
  const isMobile = window.innerWidth < 768;
  const itemsPerPage = isMobile ? 5 : 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Details modal
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Reject confirmation modal
  const [rejectRequestId, setRejectRequestId] = useState(null);

  async function load() {
    try {
      const res = await api.get("/hospital/requests");
      setRequests(res.data || []);
    } catch (err) {
      console.error("Load requests error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, status) {
    try {
      await api.put(`/hospital/requests/${id}/status`, { status });
      load();
    } catch (err) {
      alert("Failed to update request");
    }
  }

  if (loading)
    return (
      <div className="w-full flex justify-center mt-20">
        <Loader size={60} />
      </div>
    );

  // ⭐ Priority Sorting
  const priority = {
    Pending: 1,
    Approved: 2,
    Fulfilled: 3,
    Rejected: 4,
  };

  const sorted = [...requests].sort((a, b) => {
    if (priority[a.status] !== priority[b.status]) {
      return priority[a.status] - priority[b.status];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // ⭐ SEARCH + FILTER LOGIC
  const filtered = sorted.filter((r) => {
    const s = search.toLowerCase();

    const matchSearch =
      r.recipient?.name?.toLowerCase().includes(s) ||
      r.bloodGroup?.toLowerCase().includes(s) ||
      r.requestType?.toLowerCase().includes(s) ||
      new Date(r.createdAt).toLocaleDateString().includes(s);

    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    const matchType =
      requestTypeFilter === "All" || r.requestType === requestTypeFilter;

    return matchSearch && matchStatus && matchType;
  });

  // ⭐ Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const firstIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(firstIndex, firstIndex + itemsPerPage);

  return (
    <div className="w-full space-y-6 mt-4 pb-10">

      {/* HEADER */}
      <header className="py-4 text-center">
        <h1 className="text-3xl font-semibold text-red-600 dark:text-red-400">
          Recipient Requests
        </h1>
      </header>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">

        {/* SEARCH */}
        <Input
          placeholder="Search name, blood group, type or date..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="md:w-1/3"
        />

        {/* STATUS FILTER */}
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="md:w-48 w-full">
            <SelectValue placeholder="All Requests" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Fulfilled">Fulfilled</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* REQUEST TYPE FILTER */}
        <Select
          value={requestTypeFilter}
          onValueChange={(val) => {
            setRequestTypeFilter(val);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="md:w-48 w-full">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Emergency">Emergency</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block px-2">
        <Table>
          <TableCaption>Recipient requests sent to your hospital</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No matching requests.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((r) => (
                <TableRow
                  key={r._id}
                  className={
                    r.requestType === "Emergency" &&
                    r.status !== "Fulfilled" &&
                    r.status !== "Rejected"
                      ? "border-l-4 border-red-600 bg-red-50/40 dark:bg-red-950/20"
                      : ""
                  }
                >
                  <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{r.recipient?.name}</TableCell>
                  <TableCell>{r.bloodGroup}</TableCell>
                  <TableCell>{r.quantity}</TableCell>

                  <TableCell>
                    {r.requestType}
                    {r.requestType === "Emergency" && (
                      <span className="ml-2 px-2 py-1 text-xs bg-red-600 text-white rounded">
                        Emergency
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="capitalize">{r.status}</TableCell>

                  {/* ACTION ICONS */}
                  <TableCell>
                    <div className="flex items-center gap-6">

                      {/* DETAILS */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Eye
                              size={24}
                              className="text-gray-700 cursor-pointer hover:scale-125 transition"
                              onClick={() => {
                                setSelectedRequest(r);
                                setShowDetails(true);
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>View Details</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* APPROVE */}
                      {r.status === "Pending" && (
                        <Check
                          size={24}
                          className="text-green-600 cursor-pointer hover:scale-125 transition"
                          onClick={() => updateStatus(r._id, "Approved")}
                        />
                      )}

                      {/* FULFILL */}
                      {r.status === "Approved" && (
                        <CheckCheck
                          size={24}
                          className="text-blue-600 cursor-pointer hover:scale-125 transition"
                          onClick={() => updateStatus(r._id, "Fulfilled")}
                        />
                      )}

                      {/* REJECT (with confirmation) */}
                      {r.status !== "Fulfilled" && r.status !== "Rejected" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <X
                              size={24}
                              className="text-red-600 cursor-pointer hover:scale-125 transition"
                              onClick={() => setRejectRequestId(r._id)}
                            />
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject this request?</AlertDialogTitle>
                              <p className="text-sm text-gray-600">
                                This action cannot be undone.
                              </p>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>

                              <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={() => {
                                  updateStatus(rejectRequestId, "Rejected");
                                  setRejectRequestId(null);
                                }}
                              >
                                Yes, Reject
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

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden px-2 space-y-4">

        {currentItems.map((r) => (
          <Card
            key={r._id}
            className={`p-4 shadow-sm border space-y-2 ${
              r.requestType === "Emergency" &&
              r.status !== "Fulfilled" &&
              r.status !== "Rejected"
                ? "border-l-4 border-red-600 bg-red-50/40 dark:bg-red-950/20"
                : ""
            }`}
          >
            <p className="text-sm text-gray-500">
              {new Date(r.createdAt).toLocaleDateString()}
            </p>

            <p className="text-lg font-semibold text-red-600">
              {r.recipient?.name}
            </p>

            <p><strong>Blood Group:</strong> {r.bloodGroup}</p>
            <p><strong>Quantity:</strong> {r.quantity}</p>

            <p>
              <strong>Type:</strong> {r.requestType}
              {r.requestType === "Emergency" && (
                <span className="ml-2 px-2 py-1 text-xs bg-red-600 text-white rounded">
                  Emergency
                </span>
              )}
            </p>

            <p><strong>Status:</strong> {r.status}</p>

            <div className="flex gap-8 mt-4">

              {/* DETAILS */}
              <Eye
                size={28}
                className="text-gray-700 cursor-pointer hover:scale-125 transition"
                onClick={() => {
                  setSelectedRequest(r);
                  setShowDetails(true);
                }}
              />

              {/* APPROVE */}
              {r.status === "Pending" && (
                <Check
                  size={28}
                  className="text-green-600 cursor-pointer hover:scale-125 transition"
                  onClick={() => updateStatus(r._id, "Approved")}
                />
              )}

              {/* FULFILL */}
              {r.status === "Approved" && (
                <CheckCheck
                  size={28}
                  className="text-blue-600 cursor-pointer hover:scale-125 transition"
                  onClick={() => updateStatus(r._id, "Fulfilled")}
                />
              )}

              {/* REJECT (mobile) */}
              {r.status !== "Fulfilled" && r.status !== "Rejected" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <X
                      size={28}
                      className="text-red-600 cursor-pointer hover:scale-125 transition"
                      onClick={() => setRejectRequestId(r._id)}
                    />
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reject this request?</AlertDialogTitle>
                      <p className="text-sm text-gray-600">This action cannot be undone.</p>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>

                      <AlertDialogAction
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={() => {
                          updateStatus(rejectRequestId, "Rejected");
                          setRejectRequestId(null);
                        }}
                      >
                        Yes, Reject
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

            </div>

          </Card>
        ))}
      </div>

      {/* PAGINATION */}
      {filtered.length > 0 && (
        <div className="flex justify-center mt-4 gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-4 py-2 text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* -------- DETAILS MODAL -------- */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-3 mt-3 text-sm">
              <p><strong>Date:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
              <p><strong>Recipient:</strong> {selectedRequest.recipient?.name}</p>
              <p><strong>Blood Group:</strong> {selectedRequest.bloodGroup}</p>
              <p><strong>Quantity:</strong> {selectedRequest.quantity}</p>

              <p>
                <strong>Request Type:</strong> {selectedRequest.requestType}
                {selectedRequest.requestType === "Emergency" && (
                  <span className="ml-2 px-2 py-1 text-xs bg-red-600 text-white rounded">
                    Emergency
                  </span>
                )}
              </p>

              <p><strong>Status:</strong> {selectedRequest.status}</p>
            </div>
          )}

        </DialogContent>
      </Dialog>

    </div>
  );
}
