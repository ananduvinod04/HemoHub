// src/pages/recipient/RecipientRequests.jsx
import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow, TableCaption
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function RecipientRequests() {
  const [requests, setRequests] = useState([]);

  async function load() {
    const res = await api.get("/recipient/requests");
    setRequests(res.data.data);
  }

  useEffect(() => { load(); }, []);

  async function remove(id) {
    await api.delete(`/recipient/request/${id}`);
    load();
  }

  return (
    <div>
      <Table>
        <TableCaption>Your blood requests</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Hospital</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {requests.map((r) => (
            <TableRow key={r._id}>
              <TableCell>{r.hospital?.hospitalName}</TableCell>
              <TableCell>{r.bloodGroup}</TableCell>
              <TableCell>{r.quantity}</TableCell>
              <TableCell>{r.status}</TableCell>
              <TableCell>
                <Button
                  className="bg-red-600 text-white"
                  onClick={() => remove(r._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
