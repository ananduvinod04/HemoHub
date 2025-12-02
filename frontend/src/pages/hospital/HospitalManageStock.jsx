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
import Loader from "@/components/common/Loader";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


export default function HospitalManageStock() {
  const [stock, setStock] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ units: "", expiryDate: "" });
  const [loading, setLoading] = useState(true);

  // Search + Filter states
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  async function load() {
    try {
      const res = await api.get("/hospital/stock");
      setStock(res.data || []);
    } catch (err) {
      console.error("Load stock error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    if (!confirm("Delete this stock record?")) return;
    try {
      await api.delete(`/hospital/stock/${id}`);
      load();
    } catch (err) {
      console.error("Delete stock error:", err);
      alert("Failed to delete");
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setEditValues({
      units: item.units,
      expiryDate: item.expiryDate ? item.expiryDate.slice(0, 10) : "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValues({ units: "", expiryDate: "" });
  }

  async function saveEdit(id) {
    try {
      await api.put(`/hospital/stock/${id}`, {
        units: Number(editValues.units),
        expiryDate: editValues.expiryDate,
      });
      setEditingId(null);
      load();
    } catch (err) {
      console.error("Update stock error:", err);
      alert("Update failed");
    }
  }

  if (loading) return <Loader />;

  // ---------------- FILTER + SEARCH LOGIC ----------------
  const filteredStock = stock.filter((item) => {
    const matchesSearch =
      item.bloodGroup.toLowerCase().includes(search.toLowerCase()) ||
      String(item.units).includes(search) ||
      (item.expiryDate || "").includes(search);

    const matchesStatus =
      filterStatus === "All" || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full space-y-6">

      {/* -------------------- HEADER -------------------- */}
      <header className="px-4 py-6 bg-white dark:bg-gray-900 shadow-sm rounded-lg mt-4">
        <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">
          Manage Blood Stock
        </h2>
      </header>

      {/* -------------------- SEARCH + FILTER -------------------- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">

        {/* SEARCH */}
        <Input
          placeholder="Search by blood group, units, date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
        />

        {/* FILTER */}
        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
          <SelectTrigger className="md:w-48 w-full">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Expired">Expired</SelectItem>
            <SelectItem value="Low">Low Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* -------------------- DESKTOP TABLE -------------------- */}
      <div className="hidden md:block px-2">
        <Table>
          <TableCaption>Your hospital blood stock details</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Blood Group</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredStock.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-600">
                  No matching records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredStock.map((s) => (
                <TableRow key={s._id}>
                  <TableCell className="font-medium">{s.bloodGroup}</TableCell>

                  <TableCell>
                    {editingId === s._id ? (
                      <Input
                        type="number"
                        value={editValues.units}
                        onChange={(e) =>
                          setEditValues({ ...editValues, units: e.target.value })
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
                        value={editValues.expiryDate}
                        onChange={(e) =>
                          setEditValues({ ...editValues, expiryDate: e.target.value })
                        }
                      />
                    ) : s.expiryDate ? (
                      new Date(s.expiryDate).toLocaleDateString()
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>{s.status || "Available"}</TableCell>

                  <TableCell className="space-x-2">
                    {editingId === s._id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => saveEdit(s._id)}
                          className="bg-green-600 text-white"
                        >
                          Save
                        </Button>
                        <Button size="sm" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" onClick={() => startEdit(s)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => remove(s._id)}
                          className="bg-red-600 text-white"
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* -------------------- MOBILE CARDS -------------------- */}
      <div className="md:hidden space-y-4 px-2">
        {filteredStock.length === 0 ? (
          <p className="text-center text-gray-600">No records found.</p>
        ) : (
          filteredStock.map((s) => (
            <Card key={s._id} className="p-4 shadow-sm border">

              <p className="text-lg font-bold text-red-600">{s.bloodGroup}</p>

              {/* Units */}
              <p className="text-sm mt-2">
                <span className="font-semibold">Units:</span>{" "}
                {editingId === s._id ? (
                  <Input
                    type="number"
                    className="mt-1"
                    value={editValues.units}
                    onChange={(e) =>
                      setEditValues({ ...editValues, units: e.target.value })
                    }
                  />
                ) : (
                  s.units
                )}
              </p>

              {/* Expiry */}
              <p className="text-sm mt-1">
                <span className="font-semibold">Expiry:</span>{" "}
                {editingId === s._id ? (
                  <Input
                    type="date"
                    value={editValues.expiryDate}
                    className="mt-1"
                    onChange={(e) =>
                      setEditValues({ ...editValues, expiryDate: e.target.value })
                    }
                  />
                ) : s.expiryDate ? (
                  new Date(s.expiryDate).toLocaleDateString()
                ) : (
                  "-"
                )}
              </p>

              {/* Status */}
              <p className="text-sm mt-1">
                <span className="font-semibold">Status:</span> {s.status || "Available"}
              </p>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                {editingId === s._id ? (
                  <>
                    <Button
                      size="sm"
                      className="bg-green-600 text-white"
                      onClick={() => saveEdit(s._id)}
                    >
                      Save
                    </Button>
                    <Button size="sm" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" onClick={() => startEdit(s)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => remove(s._id)}
                      className="bg-red-600 text-white"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
