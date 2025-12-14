import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
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

// Page Loader
import Loader from "@/components/common/Loader";

//  Lucide Icon
import { Trash2 } from "lucide-react";

export default function RecipientRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search + Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  async function load() {
    try {
      const res = await api.get("/recipient/requests");
      setRequests(res.data.data || []);
    } catch (err) {
      console.log("Error loading requests:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    try {
      await api.delete(`/recipient/request/${id}`);
      load();
    } catch (err) {
      alert("Failed to delete request");
    }
  }

  // PAGE LOADING
  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader size={80} />
      </div>
    );

  // ----------------- SEARCH + FILTER LOGIC -----------------
  const filtered = requests.filter((r) => {
    const s = search.toLowerCase();

    const match =
      r.hospital?.hospitalName.toLowerCase().includes(s) ||
      r.bloodGroup.toLowerCase().includes(s) ||
      r.quantity.toString().includes(s) ||
      new Date(r.createdAt).toLocaleDateString().includes(s);

    const matchStatus = statusFilter === "All" || r.status === statusFilter;

    return match && matchStatus;
  });

  return (
    <div className="w-full space-y-6">

      {/* ---------------- HEADER ---------------- */}
      <header className="py-2 text-center mt-2 mb-1">
        <h1 className="text-3xl font-semibold text-red-600 dark:text-red-400">
          My Blood Requests
        </h1>
      </header>

      {/* ---------------- SEARCH + FILTER ---------------- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">

        <Input
          placeholder="Search by hospital, blood group, qty or date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-48 w-full">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ---------------- DESKTOP TABLE VIEW ---------------- */}
      <div className="hidden md:block px-2">
        <Table>
          <TableCaption>Your blood requests</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Hospital</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                  No requests found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{r.hospital?.hospitalName}</TableCell>
                  <TableCell>{r.bloodGroup}</TableCell>
                  <TableCell>{r.quantity}</TableCell>
                  <TableCell className="capitalize">{r.status}</TableCell>
                  <TableCell>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Trash2
                      size={20}
                      className="text-red-600 cursor-pointer hover:scale-110 transition"
                      onClick={() => remove(r._id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </div>

      {/* ---------------- MOBILE CARD VIEW ---------------- */}
      <div className="md:hidden px-2 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-600">No requests f{/* ⭐ NEW */}ound.</p>
        ) : (
          filtered.map((r) => (
            <Card key={r._id} className="p-4 shadow-sm border space-y-2">

              <p className="text-lg font-bold text-red-600">
                {r.hospital?.hospitalName}
              </p>

              <p>
                <strong>Blood Group:</strong> {r.bloodGroup}
              </p>

              <p>
                <strong>Quantity:</strong> {r.quantity}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{r.status}</span>
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(r.createdAt).toLocaleDateString()}
              </p>

              {/* Mobile delete icon */}
              <div className="flex justify-end mt-3">
                <Trash2
                  size={22}
                  className="text-red-600 cursor-pointer hover:scale-110 transition"
                  onClick={() => remove(r._id)}
                />
              </div>

            </Card>
          ))
        )}
      </div>

    </div>
  );
}
