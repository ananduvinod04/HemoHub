
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

export default function HospitalRecipientRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api.get("/hospital/requests");
      setRequests(res.data || []);
    } catch (err) {
      console.error("Load requests error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, status) {
    try {
      await api.put(`/hospital/requests/${id}/status`, { status });
      load();
    } catch (err) {
      console.error("Update request status:", err);
      alert("Failed to update");
    }
  }

  if (loading) return <p>Loading requests...</p>;

  return (
    <div>
      <Table>
        <TableCaption>Recipient requests to your hospital</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Recipient</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {requests.map((r) => (
            <TableRow key={r._id}>
              <TableCell>{r.recipient?.name || "-"}</TableCell>
              <TableCell>{r.bloodGroup}</TableCell>
              <TableCell>{r.quantity}</TableCell>
              <TableCell>{r.requestType}</TableCell>
              <TableCell className="capitalize">{r.status}</TableCell>
              <TableCell>
                {r.status !== "Approved" && (
                  <Button size="sm" onClick={() => updateStatus(r._id, "Approved")} className="mr-2 bg-green-600 text-white">Approve</Button>
                )}
                {r.status !== "Rejected" && (
                  <Button size="sm" onClick={() => updateStatus(r._id, "Rejected")} className="bg-red-600 text-white">Reject</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
