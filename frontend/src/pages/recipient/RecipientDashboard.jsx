import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Loader from "@/components/common/Loader";

export default function RecipientDashboard() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    recentRequests: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/recipient/dashboard");
        setStats(res.data.data);
      } catch (err) {
        console.log("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const { totalRequests, recentRequests } = stats;

  if (loading)
    return (
   <div className="w-full h-screen flex items-center justify-center">
  <Loader size={80} />
</div>
    );

  return (
    <div className="space-y-8 w-full">

      {/* ---------------- HEADER ---------------- */}
      <header className="px-4 py-6 bg-white dark:bg-gray-900 shadow-sm rounded-lg mt-4">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">
          Recipient Dashboard
        </h1>
      </header>

      {/* ---------------- SUMMARY TILES ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">

        <Card className="border shadow-sm text-center">
          <CardContent className="p-6">
            <p className="text-4xl font-bold text-red-600">{totalRequests}</p>
            <p className="text-gray-600">Total Requests</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm text-center">
          <CardContent className="p-6">
            <p className="text-4xl font-bold text-green-600">
              {recentRequests.filter(r => r.status === "Approved").length}
            </p>
            <p className="text-gray-600">Approved</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm text-center">
          <CardContent className="p-6">
            <p className="text-4xl font-bold text-yellow-600">
              {recentRequests.filter(r => r.status === "Pending").length}
            </p>
            <p className="text-gray-600">Pending</p>
          </CardContent>
        </Card>

      </div>

      {/* ---------------- RECENT REQUESTS ---------------- */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Requests</CardTitle>
        </CardHeader>

        <CardContent>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block">
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
                      <TableCell className="capitalize">{req.status}</TableCell>
                      <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden space-y-4">
            {recentRequests.length === 0 ? (
              <p className="text-center text-gray-500">No requests found.</p>
            ) : (
              recentRequests.map((req, i) => (
                <Card key={i} className="border p-4 shadow-sm space-y-2">

                  <p className="text-lg font-bold text-red-600">
                    {req.hospital?.hospitalName || "Unknown Hospital"}
                  </p>

                  <p>
                    <strong>Blood Group:</strong> {req.bloodGroup}
                  </p>

                  <p>
                    <strong>Units:</strong> {req.quantity}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="capitalize">{req.status}</span>
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>

                </Card>
              ))
            )}
          </div>

        </CardContent>
      </Card>

    </div>
  );
}
