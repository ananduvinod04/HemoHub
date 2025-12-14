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

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import Loader from "@/components/common/Loader";

export default function RecipientBloodStock() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search + Filter
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("All");

  // Pagination
  const [page, setPage] = useState(1);
  const isMobile = window.innerWidth < 768;
  const ITEMS_PER_PAGE = isMobile ? 5 : 10;

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/recipient/all-blood-stock");
        setStock(res.data);
      } catch (err) {
        console.log("Load blood stock error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Reset page on search/filter change
  useEffect(() => {
    setPage(1);
  }, [search, groupFilter]);

  // PAGE LOADING
  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader size={80} />
      </div>
    );

  // ----------------- SEARCH + FILTER -----------------
  const filtered = stock.filter((s) => {
    const sLower = search.toLowerCase();

    const match =
      s.hospital?.hospitalName.toLowerCase().includes(sLower) ||
      s.hospital?.address?.toLowerCase().includes(sLower) ||
      s.bloodGroup.toLowerCase().includes(sLower);

    const matchGroup = groupFilter === "All" || s.bloodGroup === groupFilter;

    return match && matchGroup;
  });

  // ----------------- PAGINATION -----------------
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedData = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="w-full space-y-6">

      {/* HEADER */}
      <header className="py-2 text-center mt-2 mb-1">
        <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">
          Blood Stock Availability
        </h2>
      </header>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">
        <Input
          placeholder="Search by hospital, address, or blood group..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
        />

        <Select value={groupFilter} onValueChange={setGroupFilter}>
          <SelectTrigger className="md:w-48 w-full">
            <SelectValue placeholder="Filter blood group" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {bloodGroups.map((bg) => (
              <SelectItem key={bg} value={bg}>
                {bg}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block px-2">
        <Table>
          <TableCaption>Available blood stock in all hospitals</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Hospital</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Expiry</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  No blood stock available.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>{s.hospital?.hospitalName}</TableCell>
                  <TableCell>{s.hospital?.address || "N/A"}</TableCell>
                  <TableCell>{s.bloodGroup}</TableCell>
                  <TableCell>{s.units}</TableCell>
                  <TableCell>
                    {new Date(s.expiryDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden px-2 space-y-4">
        {paginatedData.length === 0 ? (
          <p className="text-center text-gray-600">No blood stock found.</p>
        ) : (
          paginatedData.map((s) => (
            <Card key={s._id} className="p-4 shadow-sm border space-y-2">
              <p className="text-lg font-bold text-red-600">
                {s.hospital?.hospitalName}
              </p>

              <p><strong>Address:</strong> {s.hospital?.address || "N/A"}</p>
              <p><strong>Blood Group:</strong> {s.bloodGroup}</p>
              <p><strong>Units:</strong> {s.units}</p>
              <p>
                <strong>Expiry:</strong>{" "}
                {new Date(s.expiryDate).toLocaleDateString()}
              </p>
            </Card>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center py-6">
          <Pagination>
            <PaginationContent>

              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

            </PaginationContent>
          </Pagination>
        </div>
      )}

    </div>
  );
}
