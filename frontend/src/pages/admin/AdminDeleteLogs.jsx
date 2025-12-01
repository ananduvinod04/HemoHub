
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
import Loader from "@/components/common/Loader";

export default function AdminDeleteLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api.get("/admin/deletelogs");
      setLogs(res.data.data || res.data || []);
    } catch (err) {
      console.error("Load delete logs error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function restore(id) {
    if (!confirm("Restore this item?")) return;
    try {
      await api.put(`/admin/deletelogs/${id}/restore`);
      load();
      alert("Restored successfully");
    } catch (err) {
      console.error("Restore error:", err);
      alert("Restore failed");
    }
  }

  if (loading) return <Loader className="h-12 w-12" />;

  return (
    <div>
      <Table>
        <TableCaption>Deleted items — audit & recovery</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Deleted At</TableHead>
            <TableHead>Data Snapshot</TableHead>
            <TableHead>Recovered</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {logs.map((l) => (
            <TableRow key={l._id}>
              <TableCell>{l.itemType}</TableCell>
              <TableCell>{new Date(l.deletedAt).toLocaleString()}</TableCell>
              <TableCell>
                <pre className="max-w-sm overflow-auto text-xs">{JSON.stringify(l.deletedData, null, 2)}</pre>
              </TableCell>
              <TableCell>{l.recovered ? "Yes" : "No"}</TableCell>
              <TableCell>
                {!l.recovered && (
                  <Button size="sm" onClick={() => restore(l._id)} className="bg-green-600 text-white">Restore</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
