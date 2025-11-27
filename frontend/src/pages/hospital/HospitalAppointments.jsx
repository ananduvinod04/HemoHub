
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

export default function HospitalAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api.get("/hospital/appointments");
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Load appointments error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, status) {
    try {
      await api.put(`/hospital/appointments/${id}/status`, { status });
      load();
    } catch (err) {
      console.error("Update appointment status:", err);
      alert("Failed to update status");
    }
  }

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div>
      <Table>
        <TableCaption>Donor appointments for your hospital</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Donor</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {appointments.map((a) => (
            <TableRow key={a._id}>
              <TableCell>{a.donor?.name || "-"}</TableCell>
              <TableCell>{a.type}</TableCell>
              <TableCell>{new Date(a.date).toLocaleDateString()}</TableCell>
              <TableCell className="capitalize">{a.status}</TableCell>
              <TableCell>
                {a.status !== "Approved" && (
                  <Button size="sm" onClick={() => updateStatus(a._id, "Approved")} className="mr-2 bg-green-600 text-white">Approve</Button>
                )}
                {a.status !== "Rejected" && (
                  <Button size="sm" onClick={() => updateStatus(a._id, "Rejected")} className="bg-red-600 text-white">Reject</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
