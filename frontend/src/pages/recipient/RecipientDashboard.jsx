import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RecipientDashboard() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    recentRequests: []
  });

  useEffect(() => {
    (async () => {
      const res = await api.get("/recipient/dashboard");
      setStats(res.data.data);
    })();
  }, []);

  const { totalRequests, recentRequests } = stats;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-red-600">Recipient Dashboard</h1>

      {/* Summary Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <p className="text-4xl font-bold text-red-600">{totalRequests}</p>
            <p className="text-gray-600">Total Requests</p>
          </CardContent>
        </Card>

        {/* Approved */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <p className="text-4xl font-bold text-green-600">
              {recentRequests.filter(r => r.status === "Approved").length}
            </p>
            <p className="text-gray-600">Approved</p>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <p className="text-4xl font-bold text-yellow-600">
              {recentRequests.filter(r => r.status === "Pending").length}
            </p>
            <p className="text-gray-600">Pending</p>
          </CardContent>
        </Card>

      </div>

      {/* Recent Requests Table */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Your 5 latest blood requests</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital</TableHead>
                <TableHead>Blood</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                    No requests found.
                  </TableCell>
                </TableRow>
              ) : (
                recentRequests.map((req, i) => (
                  <TableRow key={i}>
                    <TableCell>{req.hospital?.hospitalName}</TableCell>
                    <TableCell>{req.bloodGroup}</TableCell>
                    <TableCell>{req.quantity}</TableCell>
                    <TableCell>{req.status}</TableCell>
                    <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
