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
import { Card } from "@/components/ui/card";
import Loader from "@/components/common/Loader";

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

  if (loading)
    return (
      <div className="w-full flex justify-center mt-20">
        <Loader size={60} />
      </div>
    );

  return (
    <div className="w-full space-y-6">

      {/* ----------- HEADER ----------- */}
      <header className="px-4 py-6 bg-white dark:bg-gray-900 shadow-sm rounded-lg mt-4">
        <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">
          Recipient Requests
        </h2>
      </header>

      {/* -------- DESKTOP TABLE VIEW -------- */}
      <div className="hidden md:block px-2">
        <Table>
          <TableCaption>Recipient requests sent to your hospital</TableCaption>

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
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No requests found.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{r.recipient?.name || "-"}</TableCell>
                  <TableCell>{r.bloodGroup}</TableCell>
                  <TableCell>{r.quantity}</TableCell>
                  <TableCell>{r.requestType}</TableCell>
                  <TableCell className="capitalize">{r.status}</TableCell>
                  <TableCell className="space-x-2">
                    {r.status !== "Approved" && (
                      <Button
                        size="sm"
                        className="bg-green-600 text-white"
                        onClick={() => updateStatus(r._id, "Approved")}
                      >
                        Approve
                      </Button>
                    )}
                    {r.status !== "Rejected" && (
                      <Button
                        size="sm"
                        className="bg-red-600 text-white"
                        onClick={() => updateStatus(r._id, "Rejected")}
                      >
                        Reject
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* -------- MOBILE CARD VIEW -------- */}
      <div className="md:hidden px-2 space-y-4">
        {requests.length === 0 ? (
          <p className="text-center text-gray-600">No Requests Found</p>
        ) : (
          requests.map((r) => (
            <Card key={r._id} className="p-4 shadow-sm border space-y-2">

              <p className="text-lg font-semibold text-red-600">
                {r.recipient?.name || "Unknown Recipient"}
              </p>

              <p>
                <strong>Blood Group:</strong> {r.bloodGroup}
              </p>

              <p>
                <strong>Quantity:</strong> {r.quantity}
              </p>

              <p>
                <strong>Request Type:</strong> {r.requestType}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{r.status}</span>
              </p>

              {/* -------- Mobile Action Buttons -------- */}
              <div className="flex flex-col gap-2 mt-3 w-full">

                {r.status !== "Approved" && (
                  <Button
                    size="sm"
                    className="bg-green-600 text-white w-full"
                    onClick={() => updateStatus(r._id, "Approved")}
                  >
                    Approve
                  </Button>
                )}

                {r.status !== "Rejected" && (
                  <Button
                    size="sm"
                    className="bg-red-600 text-white w-full"
                    onClick={() => updateStatus(r._id, "Rejected")}
                  >
                    Reject
                  </Button>
                )}

              </div>

            </Card>
          ))
        )}
      </div>

    </div>
  );
}
