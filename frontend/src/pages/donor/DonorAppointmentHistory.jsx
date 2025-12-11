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
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Loader from "@/components/common/Loader";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";

export default function DonorAppointmentHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = window.innerWidth < 768 ? 6 : 12;

  // Fetch history
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await api.get("/donor/appointments/history");
        setHistory(res.data.appointments || []);
      } catch (error) {
        console.log("History Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (loading) return <Loader size={64} className="mt-20" />;

  // ---------------- FILTER + SEARCH ----------------
  const filtered = history.filter((item) => {
    const matchesSearch =
      item.hospitalName.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || item.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const firstIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(firstIndex, firstIndex + itemsPerPage);

  return (
    <div className="w-full space-y-10 mt-10 md:mt-12 px-2">

      {/* ---------------- HEADER SECTION ---------------- */}
      <header className="py-4 text-center">
        <h1 className="text-3xl font-semibold text-red-600 dark:text-red-400">
          Appointment History
        </h1>
      </header>

      {/* ---------------- SEARCH + FILTER ---------------- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Input
          placeholder="Search by hospital or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
        />

        <Select value={filterStatus} onValueChange={setFilterStatus}>
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

      {/* ---------------- TABLE (DESKTOP) ---------------- */}
      <div className="hidden md:block">
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-red-600">
              Your Appointment Records
            </CardTitle>
          </CardHeader>

          <CardContent className="mt-4">
            <Table>
              <TableCaption>Complete appointment history</TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No matching appointments.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((appt) => (
                    <TableRow key={appt._id}>
                      <TableCell className="font-medium">{appt.hospitalName}</TableCell>
                      <TableCell>{appt.type}</TableCell>
                      <TableCell>{new Date(appt.date).toLocaleDateString()}</TableCell>
                      <TableCell className="capitalize">{appt.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ---------------- MOBILE CARDS ---------------- */}
      <div className="md:hidden space-y-4">
        {currentItems.length === 0 ? (
          <p className="text-center text-gray-500">No appointments found.</p>
        ) : (
          currentItems.map((appt) => (
            <Card key={appt._id} className="border shadow-sm p-4">
              <h3 className="text-lg font-semibold text-red-600">{appt.type}</h3>

              <p>
                <span className="font-semibold">Hospital:</span> {appt.hospitalName}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(appt.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={
                    appt.status === "Approved"
                      ? "text-green-600"
                      : appt.status === "Pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }
                >
                  {appt.status}
                </span>
              </p>
            </Card>
          ))
        )}
      </div>

      {/* ---------------- PAGINATION - FIXED AT BOTTOM ---------------- */}
      {filtered.length > 0 && (
        <div className="flex justify-center mt-8 mb-4">
          <Pagination>
            <PaginationContent>

              {/* Prev */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-40" : ""}
                />
              </PaginationItem>

              {/* Number buttons */}
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

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  className={currentPage === totalPages ? "pointer-events-none opacity-40" : ""}
                />
              </PaginationItem>

            </PaginationContent>
          </Pagination>
        </div>
      )}

    </div>
  );
}
