
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

  useEffect(() => { load(); }, []);

  function startEdit(s) {
    setEditingId(s._id);
    setEditVals({ units: s.units, expiryDate: s.expiryDate ? s.expiryDate.slice(0,10) : "" });
  }

  function cancel() {
    setEditingId(null);
    setEditVals({ units: "", expiryDate: "" });
  }

  async function save(id) {
    try {
      await api.put(`/admin/stock/${id}`, { units: Number(editVals.units), expiryDate: editVals.expiryDate });
      load();
      setEditingId(null);
    } catch (err) {
      console.error("Save stock error:", err);
      alert("Save failed");
    }
  }

  if (loading) return <p>Loading stocks...</p>;

  return (
    <div>
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
            <TableRow key={s._id}>
              <TableCell>{s.hospital?.hospitalName || "-"}</TableCell>
              <TableCell>{s.bloodGroup}</TableCell>
              <TableCell>
                {editingId === s._id ? (
                  <Input value={editVals.units} onChange={(e) => setEditVals({ ...editVals, units: e.target.value })} />
                ) : (
                  s.units
                )}
              </TableCell>

              <TableCell>
                {editingId === s._id ? (
                  <Input type="date" value={editVals.expiryDate} onChange={(e) => setEditVals({ ...editVals, expiryDate: e.target.value })} />
                ) : (
                  s.expiryDate ? new Date(s.expiryDate).toLocaleDateString() : "-"
                )}
              </TableCell>

              <TableCell>{s.status || "Available"}</TableCell>

              <TableCell>
                {editingId === s._id ? (
                  <>
                    <Button size="sm" className="mr-2 bg-green-600 text-white" onClick={() => save(s._id)}>Save</Button>
                    <Button size="sm" onClick={cancel}>Cancel</Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => startEdit(s)}>Edit</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
