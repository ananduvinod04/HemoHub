
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

export default function AdminManageRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api.get("/admin/requests");
      setRequests(res.data.data || res.data || []);
    } catch (err) {
      console.error("Load admin requests error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <p>Loading requests...</p>;

  return (
    <div>
      <Table>
        <TableCaption>All recipient requests (system-wide)</TableCaption>

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
          {requests.map((r) => (
            <TableRow key={r._id}>
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
  );
}
