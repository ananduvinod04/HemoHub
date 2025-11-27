
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

export default function HospitalManageStock() {
  const [stock, setStock] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ units: "", expiryDate: "" });
  const [loading, setLoading] = useState(true);

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
    setEditValues({ units: item.units, expiryDate: item.expiryDate ? item.expiryDate.slice(0,10) : "" });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValues({ units: "", expiryDate: "" });
  }

  async function saveEdit(id) {
    try {
      await api.put(`/hospital/stock/${id}`, {
        units: Number(editValues.units),
        expiryDate: editValues.expiryDate
      });
      setEditingId(null);
      load();
    } catch (err) {
      console.error("Update stock error:", err);
      alert("Update failed");
    }
  }

  if (loading) return <p>Loading stock...</p>;

  return (
    <div>
      <Table>
        <TableCaption>Manage your hospital stock</TableCaption>

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
          {stock.map((s) => (
            <TableRow key={s._id}>
              <TableCell className="font-medium">{s.bloodGroup}</TableCell>

              <TableCell>
                {editingId === s._id ? (
                  <Input
                    type="number"
                    value={editValues.units}
                    onChange={(e) => setEditValues({ ...editValues, units: e.target.value })}
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
                    onChange={(e) => setEditValues({ ...editValues, expiryDate: e.target.value })}
                  />
                ) : (
                  s.expiryDate ? new Date(s.expiryDate).toLocaleDateString() : "-"
                )}
              </TableCell>

              <TableCell>{s.status || "Available"}</TableCell>

              <TableCell>
                {editingId === s._id ? (
                  <>
                    <Button size="sm" onClick={() => saveEdit(s._id)} className="mr-2 bg-green-600 text-white">Save</Button>
                    <Button size="sm" onClick={cancelEdit}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" onClick={() => startEdit(s)} className="mr-2">Edit</Button>
                    <Button size="sm" onClick={() => remove(s._id)} className="bg-red-600 text-white">Delete</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
