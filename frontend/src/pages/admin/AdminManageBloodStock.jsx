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
import Loader from "@/components/common/Loader";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// ⭐ Lucide Icons
import { PencilLine, Check, X } from "lucide-react";

export default function AdminManageBloodStock() {
  const [stocks, setStocks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editVals, setEditVals] = useState({ units: "", expiryDate: "" });
  const [loading, setLoading] = useState(true);

  // Search + Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination
  const isMobile = window.innerWidth < 768;
  const itemsPerPage = isMobile ? 5 : 10;
  const [currentPage, setCurrentPage] = useState(1);

  async function load() {
    try {
      const res = await api.get("/admin/stocks");
      setStocks(res.data.data || res.data || []);
    } catch (err) {
      console.error("Load stocks error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(s) {
    setEditingId(s._id);
    setEditVals({
      units: s.units,
      expiryDate: s.expiryDate ? s.expiryDate.slice(0, 10) : "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditVals({ units: "", expiryDate: "" });
  }

  async function saveEdit(id) {
    try {
      await api.put(`/admin/stock/${id}`, {
        units: Number(editVals.units),
        expiryDate: editVals.expiryDate,
      });
      setEditingId(null);
      load();
    } catch (err) {
      alert("Save failed");
    }
  }

  if (loading) return <Loader className="h-12 w-12" />;

  // ---------------- SEARCH + FILTER ----------------
  const filtered = stocks.filter((s) => {
    const q = search.toLowerCase();

    const matchSearch =
      s.hospital?.hospitalName?.toLowerCase().includes(q) ||
      s.bloodGroup.toLowerCase().includes(q) ||
      String(s.units).includes(q) ||
      (s.expiryDate || "").includes(q);

    const matchStatus =
      statusFilter === "All" || s.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">
            Manage Blood Stock
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search hospital, blood group, units, date..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* ---------------- DESKTOP TABLE ---------------- */}
      <div className="hidden md:block">
        <Table>
          <TableCaption>All blood stock across hospitals</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Hospital</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.hospital?.hospitalName || "-"}</TableCell>
                <TableCell>{s.bloodGroup}</TableCell>

                <TableCell>
                  {editingId === s._id ? (
                    <Input
                      value={editVals.units}
                      onChange={(e) =>
                        setEditVals({ ...editVals, units: e.target.value })
                      }
                    />
                  ) : (
                    s.units
                  )}
                </TableCell>

                <TableCell>
                  {editingId === s._id ? (
                    <Input
                      type="date"
                      value={editVals.expiryDate}
                      onChange={(e) =>
                        setEditVals({ ...editVals, expiryDate: e.target.value })
                      }
                    />
                  ) : s.expiryDate ? (
                    new Date(s.expiryDate).toLocaleDateString()
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell>{s.status || "Available"}</TableCell>

                <TableCell>
                  <div className="flex gap-4">
                    {editingId === s._id ? (
                      <>
                        <Check
                          className="text-green-600 cursor-pointer hover:scale-110"
                          onClick={() => saveEdit(s._id)}
                        />
                        <X
                          className="text-red-600 cursor-pointer hover:scale-110"
                          onClick={cancelEdit}
                        />
                      </>
                    ) : (
                      <PencilLine
                        className="text-blue-600 cursor-pointer hover:scale-110"
                        onClick={() => startEdit(s)}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ---------------- MOBILE CARDS ---------------- */}
      <div className="md:hidden space-y-4">
        {currentItems.map((s) => (
          <Card key={s._id} className="p-4">
            <CardContent className="space-y-2">
              <h3 className="font-semibold">{s.hospital?.hospitalName}</h3>
              <p><strong>Blood:</strong> {s.bloodGroup}</p>

              <p>
                <strong>Units:</strong>{" "}
                {editingId === s._id ? (
                  <Input
                    value={editVals.units}
                    onChange={(e) =>
                      setEditVals({ ...editVals, units: e.target.value })
                    }
                  />
                ) : (
                  s.units
                )}
              </p>

              <p>
                <strong>Expiry:</strong>{" "}
                {editingId === s._id ? (
                  <Input
                    type="date"
                    value={editVals.expiryDate}
                    onChange={(e) =>
                      setEditVals({ ...editVals, expiryDate: e.target.value })
                    }
                  />
                ) : (
                  new Date(s.expiryDate).toLocaleDateString()
                )}
              </p>

              <p><strong>Status:</strong> {s.status}</p>

              <div className="flex justify-end gap-6 pt-2">
                {editingId === s._id ? (
                  <>
                    <Check
                      className="text-green-600 cursor-pointer"
                      onClick={() => saveEdit(s._id)}
                    />
                    <X
                      className="text-red-600 cursor-pointer"
                      onClick={cancelEdit}
                    />
                  </>
                ) : (
                  <PencilLine
                    className="text-blue-600 cursor-pointer"
                    onClick={() => startEdit(s)}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ---------------- PAGINATION ---------------- */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}
