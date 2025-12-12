import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";

import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import Loader from "@/components/common/Loader";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Lucide Icons
import { Pencil, Trash2, Save, X } from "lucide-react";

// Tooltip
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

// AlertDialog (Delete Confirmation)
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

export default function HospitalManageStock() {
  const [stock, setStock] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ units: "", expiryDate: "" });
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState(null);

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

  function startEdit(s) {
    setEditingId(s._id);
    setEditValues({
      units: s.units,
      expiryDate: s.expiryDate ? s.expiryDate.slice(0, 10) : "",
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
    }
  }

  async function deleteStock(id) {
    try {
      await api.delete(`/hospital/stock/${id}`);
      load();
    } catch (err) {
      console.error("Delete stock error:", err);
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

      {/* ---------------- HEADER ---------------- */}
      <header className="py-4 text-center">
        <h1 className="text-3xl font-semibold text-red-600 dark:text-red-400">
          Manage Blood Stock
        </h1>
      </header>

      {/* ---------------- SEARCH + FILTER ---------------- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
        <Input
          placeholder="Search by blood group, units, date..."
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
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Expired">Expired</SelectItem>
            <SelectItem value="Low">Low Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ---------------- DESKTOP TABLE ---------------- */}
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

                  {/* Units */}
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

                  {/* Expiry */}
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

                  {/* ACTION ICONS WITH TOOLTIP */}
                  <TableCell>
                    <div className="flex items-center gap-6">

                      {/* Save Icon */}
                      {editingId === s._id && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Save
                                size={22}
                                className="text-green-600 cursor-pointer hover:scale-125 transition"
                                onClick={() => saveEdit(s._id)}
                              />
                            </TooltipTrigger>
                            <TooltipContent>Save Changes</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {/* Cancel Edit */}
                      {editingId === s._id && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <X
                                size={22}
                                className="text-gray-500 cursor-pointer hover:scale-125 transition"
                                onClick={cancelEdit}
                              />
                            </TooltipTrigger>
                            <TooltipContent>Cancel Edit</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {/* Edit Icon */}
                      {editingId !== s._id && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Pencil
                                size={22}
                                className="text-blue-600 cursor-pointer hover:scale-125 transition"
                                onClick={() => startEdit(s)}
                              />
                            </TooltipTrigger>
                            <TooltipContent>Edit Stock</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {/* Delete Icon */}
                      {editingId !== s._id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Trash2
                                    size={22}
                                    className="text-red-600 cursor-pointer hover:scale-125 transition"
                                    onClick={() => setDeleteId(s._id)}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>Delete Record</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this stock record?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The record will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>No</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={() => deleteStock(deleteId)}
                              >
                                Yes, Delete
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
                    className="mt-1"
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
              </p>

              <p className="text-sm mt-1">
                <span className="font-semibold">Status:</span> {s.status || "Available"}
              </p>

              {/* MOBILE ACTION ICONS */}
              <div className="flex items-center gap-6 mt-3">

                {/* Save */}
                {editingId === s._id && (
                  <Save
                    size={22}
                    className="text-green-600 cursor-pointer hover:scale-125 transition"
                    onClick={() => saveEdit(s._id)}
                  />
                )}

                {/* Cancel */}
                {editingId === s._id && (
                  <X
                    size={22}
                    className="text-gray-500 cursor-pointer hover:scale-125 transition"
                    onClick={cancelEdit}
                  />
                )}

                {/* Edit */}
                {editingId !== s._id && (
                  <Pencil
                    size={22}
                    className="text-blue-600 cursor-pointer hover:scale-125 transition"
                    onClick={() => startEdit(s)}
                  />
                )}

                {/* Delete */}
                {editingId !== s._id && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Trash2
                        size={22}
                        className="text-red-600 cursor-pointer hover:scale-125 transition"
                        onClick={() => setDeleteId(s._id)}
                      />
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this stock record?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>No</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={() => deleteStock(deleteId)}
                        >
                          Yes, Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

              </div>
            </Card>
          ))
        )}
      </div>

    </div>
  );
}
