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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/common/Loader";

export default function AdminManageBloodStock() {
  const [stocks, setStocks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editVals, setEditVals] = useState({ units: "", expiryDate: "" });
  const [loading, setLoading] = useState(true);

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

  function cancel() {
    setEditingId(null);
    setEditVals({ units: "", expiryDate: "" });
  }

  async function save(id) {
    try {
      await api.put(`/admin/stock/${id}`, {
        units: Number(editVals.units),
        expiryDate: editVals.expiryDate,
      });
      load();
      setEditingId(null);
    } catch (err) {
      console.error("Save stock error:", err);
      alert("Save failed");
    }
  }

  // ----- Loading Stage (same as dashboard) -----
  if (loading) return <Loader className="h-12 w-12" />;

  return (
    <div className="p-6 space-y-6">

      {/* ------------------ HEADER ------------------ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">
            Manage Blood Stock
          </CardTitle>
        </CardHeader>

        <CardContent className="text-gray-500 dark:text-gray-300">
          View, edit, and update blood stock across all registered hospitals.
        </CardContent>
      </Card>

      {/* ------------------ DESKTOP TABLE VIEW ------------------ */}
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
            {stocks.map((s) => (
              <TableRow
                key={s._id}
                className="hover:bg-white/10 hover:backdrop-blur-sm transition"
              >
                <TableCell>{s.hospital?.hospitalName || "-"}</TableCell>
                <TableCell>{s.bloodGroup}</TableCell>

                {/* Units */}
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

                {/* Expiry */}
                <TableCell>
                  {editingId === s._id ? (
                    <Input
                      type="date"
                      value={editVals.expiryDate}
                      onChange={(e) =>
                        setEditVals({
                          ...editVals,
                          expiryDate: e.target.value,
                        })
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
                  {editingId === s._id ? (
                    <>
                      <Button
                        size="sm"
                        className="mr-2 bg-green-600 text-white"
                        onClick={() => save(s._id)}
                      >
                        Save
                      </Button>
                      <Button size="sm" onClick={cancel}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => startEdit(s)}>
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ------------------ MOBILE CARD VIEW ------------------ */}
      <div className="md:hidden space-y-4">
        {stocks.map((s) => (
          <Card
            key={s._id}
            className="p-4 space-y-3 hover:bg-white/10 hover:backdrop-blur-sm transition shadow-md"
          >
            <CardContent className="space-y-3">

              <h3 className="text-lg font-semibold">
                {s.hospital?.hospitalName || "-"}
              </h3>

              <p><strong>Blood Group:</strong> {s.bloodGroup}</p>

              {/* Units */}
              <div>
                <strong>Units:</strong>{" "}
                {editingId === s._id ? (
                  <Input
                    className="mt-1"
                    value={editVals.units}
                    onChange={(e) =>
                      setEditVals({ ...editVals, units: e.target.value })
                    }
                  />
                ) : (
                  s.units
                )}
              </div>

              {/* Expiry */}
              <div>
                <strong>Expiry:</strong>{" "}
                {editingId === s._id ? (
                  <Input
                    type="date"
                    className="mt-1"
                    value={editVals.expiryDate}
                    onChange={(e) =>
                      setEditVals({
                        ...editVals,
                        expiryDate: e.target.value,
                      })
                    }
                  />
                ) : s.expiryDate ? (
                  new Date(s.expiryDate).toLocaleDateString()
                ) : (
                  "-"
                )}
              </div>

              <p><strong>Status:</strong> {s.status || "Available"}</p>

              {/* Actions */}
              {editingId === s._id ? (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="bg-green-600 text-white w-full"
                    onClick={() => save(s._id)}
                  >
                    Save
                  </Button>

                  <Button
                    size="sm"
                    className="w-full"
                    onClick={cancel}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => startEdit(s)}
                >
                  Edit
                </Button>
              )}

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
