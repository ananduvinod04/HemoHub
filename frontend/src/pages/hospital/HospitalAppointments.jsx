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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import Loader from "@/components/common/Loader";

export default function HospitalAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search + Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

  async function updateStatus(id, status) {
    try {
      await api.put(`/hospital/appointments/${id}/status`, { status });
      load();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update");
    }
  }

  if (loading)
    return (
      <div className="w-full flex justify-center mt-20">
        <Loader size={60} />
      </div>
    );

  // ----------------- FILTER + SEARCH -----------------
  const filtered = appointments.filter((a) => {
    const s = search.toLowerCase();

    const match =
      a.donor?.name?.toLowerCase().includes(s) ||
      a.type?.toLowerCase().includes(s) ||
      new Date(a.date).toLocaleDateString().includes(s);

    const matchStatus =
      statusFilter === "All" || a.status === statusFilter;

    return match && matchStatus;
  });

  return (
    <div className="w-full space-y-6">

      {/* ---------------- HEADER ---------------- */}
      <header className="px-4 py-6 bg-white dark:bg-gray-900 shadow-sm rounded-lg mt-4">
        <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">
          Manage Appointments
        </h2>
      </header>

      {/* ------------- SEARCH + FILTER ------------ */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">

        <Input
          placeholder="Search donor, type, or date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
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

      {/* ------------ DESKTOP TABLE ------------ */}
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
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No matching records.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((a) => (
                <TableRow key={a._id}>
                  <TableCell>{a.donor?.name || "Unknown"}</TableCell>
                  <TableCell>{a.type}</TableCell>
                  <TableCell>{new Date(a.date).toLocaleDateString()}</TableCell>
                  <TableCell className="capitalize">{a.status}</TableCell>

                  <TableCell className="space-x-2">

                    {a.status === "Pending" && (
                      <Button
                        size="sm"
                        className="bg-green-600 text-white"
                        onClick={() => updateStatus(a._id, "Approved")}
                      >
                        Approve
                      </Button>
                    )}

                    {a.status === "Approved" && (
                      <Button
                        size="sm"
                        className="bg-blue-600 text-white"
                        onClick={() => updateStatus(a._id, "Completed")}
                      >
                        Mark Completed
                      </Button>
                    )}

                    {a.status !== "Cancelled" && a.status !== "Completed" && (
                      <Button
                        size="sm"
                        className="bg-red-600 text-white"
                        onClick={() => updateStatus(a._id, "Cancelled")}
                      >
                        Cancel
                      </Button>
                    )}

                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </div>

      {/* ------------ MOBILE CARD VIEW (UPDATED) ------------ */}
      <div className="md:hidden px-2 space-y-4">
        {filtered.map((a) => (
          <Card key={a._id} className="p-4 shadow-sm border space-y-2">

            <p className="text-lg font-semibold text-red-600">
              {a.donor?.name || "Unknown Donor"}
            </p>

            <p><strong>Type:</strong> {a.type}</p>

            <p><strong>Date:</strong> {new Date(a.date).toLocaleDateString()}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span className="capitalize">{a.status}</span>
            </p>

            {/* BUTTONS FIXED FOR MOBILE */}
            <div className="flex flex-col gap-2 mt-3 w-full">

              {a.status === "Pending" && (
                <Button
                  size="sm"
                  className="bg-green-600 text-white w-full"
                  onClick={() => updateStatus(a._id, "Approved")}
                >
                  Approve
                </Button>
              )}

              {a.status === "Approved" && (
                <Button
                  size="sm"
                  className="bg-blue-600 text-white w-full"
                  onClick={() => updateStatus(a._id, "Completed")}
                >
                  Complete
                </Button>
              )}

              {a.status !== "Cancelled" && a.status !== "Completed" && (
                <Button
                  size="sm"
                  className="bg-red-600 text-white w-full"
                  onClick={() => updateStatus(a._id, "Cancelled")}
                >
                  Cancel
                </Button>
              )}

            </div>

          </Card>
        ))}
      </div>

    </div>
  );
}
