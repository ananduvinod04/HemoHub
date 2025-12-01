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

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import Loader from "@/components/common/Loader";

export default function AdminManageRequests() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  async function load() {
    try {
      const res = await api.get("/admin/requests");
      setRequests(res.data.data || []);
      setFiltered(res.data.data || []);
    } catch (err) {
      console.error("Load admin requests error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Search + Filter Logic
  useEffect(() => {
    let list = [...requests];

    if (search.trim() !== "") {
      list = list.filter(
        (r) =>
          r.recipient?.name?.toLowerCase().includes(search.toLowerCase()) ||
          r.hospital?.hospitalName?.toLowerCase().includes(search.toLowerCase()) ||
          r.bloodGroup?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      list = list.filter((r) => r.status === statusFilter);
    }

    if (typeFilter !== "All") {
      list = list.filter((r) => r.requestType === typeFilter);
    }

    setFiltered(list);
  }, [search, statusFilter, typeFilter, requests]);

  if (loading) return <Loader className="h-12 w-12" />;

  return (
    <div className="p-6 space-y-6">

      {/* ------------------- HEADER ------------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">
            Manage Blood Requests
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* SEARCH + FILTERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* SEARCH */}
            <Input
              placeholder="Search recipient, hospital, or blood group..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* STATUS FILTER */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* TYPE FILTER */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </CardContent>
      </Card>

      {/* ------------------- DESKTOP TABLE ------------------- */}
      <div className="hidden md:block">
        <Table>
          <TableCaption>All recipient requests across hospitals</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Recipient</TableHead>
              <TableHead>Hospital</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((r) => (
              <TableRow
                key={r._id}
                className="
                  hover:bg-white/10 
                  hover:backdrop-blur-sm 
                  dark:hover:bg-white/10 
                  transition
                "
              >
                <TableCell>{r.recipient?.name || "-"}</TableCell>
                <TableCell>{r.hospital?.hospitalName || "-"}</TableCell>
                <TableCell>{r.bloodGroup}</TableCell>
                <TableCell>{r.quantity}</TableCell>
                <TableCell>{r.requestType}</TableCell>
                <TableCell className="capitalize">{r.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ------------------- MOBILE CARD VIEW ------------------- */}
      <div className="md:hidden space-y-4">
        {filtered.map((r) => (
          <Card
            key={r._id}
            className="
              p-4 
              shadow-md 
              hover:bg-white/10 
              hover:backdrop-blur-sm 
              transition 
              duration-200
            "
          >
            <CardContent className="space-y-2">

              <h3 className="text-lg font-semibold">{r.recipient?.name || "-"}</h3>

              <p>
                <strong>Hospital:</strong> {r.hospital?.hospitalName || "-"}
              </p>

              <p>
                <strong>Blood Group:</strong> {r.bloodGroup}
              </p>

              <p>
                <strong>Quantity:</strong> {r.quantity}
              </p>

              <p>
                <strong>Type:</strong> {r.requestType}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{r.status}</span>
              </p>

            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
