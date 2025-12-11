import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import Loader from "@/components/common/Loader";

export default function RecipientDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRequests: 0,
    recentRequests: [],
  });

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const dash = await api.get("/recipient/dashboard");
        const prof = await api.get("/recipient/profile");

        setStats(dash.data.data);
        setProfile(prof.data.data);
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
    <div className="space-y-4 w-full px-4 pb-6">

      {/* ---------------- HEADER (UPDATED) ---------------- */}
      <header className="py-2 text-center mt-2 mb-1">
        <h1 className="text-3xl font-semibold text-red-600 dark:text-red-400">
          Recipient Dashboard
        </h1>

        {/* Welcome Message */}
        <p className="text-base text-gray-700 dark:text-gray-300 mt-1">
          Welcome, <span className="font-semibold">{profile?.name}</span> 👋
        </p>
      </header>

      {/* ---------------- SUMMARY CARD ---------------- */}
      <Card
        className="border shadow-sm cursor-pointer hover:bg-red-50 dark:hover:bg-gray-800 transition"
        onClick={() => navigate("/recipient/requests")}
      >
        <CardHeader className="pb-1">
          <CardTitle className="text-xl font-semibold text-center">
            Request Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          <div className="grid grid-cols-3 text-center">

            <div className="flex flex-col items-center">
              <p className="text-4xl font-extrabold text-red-600 leading-tight">
                {totalRequests}
              </p>
              <p className="text-gray-600 text-sm mt-1">Total</p>
            </div>

            <div className="border-l border-gray-300 dark:border-gray-700 px-2 flex flex-col items-center">
              <p className="text-4xl font-extrabold text-green-600 leading-tight">
                {recentRequests.filter(r => r.status === "Approved").length}
              </p>
              <p className="text-gray-600 text-sm mt-1">Approved</p>
            </div>

            <div className="border-l border-gray-300 dark:border-gray-700 px-2 flex flex-col items-center">
              <p className="text-4xl font-extrabold text-yellow-600 leading-tight">
                {recentRequests.filter(r => r.status === "Pending").length}
              </p>
              <p className="text-gray-600 text-sm mt-1">Pending</p>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* ---------------- RECENT REQUESTS ---------------- */}
      <Card className="border shadow-sm">
        <CardHeader
          className="pb-1 cursor-pointer hover:text-red-600 transition"
          onClick={() => navigate("/recipient/requests")}
        >
          <CardTitle className="text-xl font-semibold">
            Recent Requests
          </CardTitle>
        </CardHeader>

        <CardContent className="p-3">
          
          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-hidden">
            <Table className="w-full">
              <TableCaption className="text-sm pb-0">
                Your latest blood requests
              </TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead className="py-2 text-base">Date</TableHead>
                  <TableHead className="py-2 text-base">Hospital</TableHead>
                  <TableHead className="py-2 text-base">Blood</TableHead>
                  <TableHead className="py-2 text-base">Units</TableHead>
                  <TableHead className="py-2 text-base">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {recentRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-3 text-base">
                      No requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentRequests.map((req, i) => (
                    <TableRow key={i} className="text-base">
                      <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{req.hospital?.hospitalName}</TableCell>
                      <TableCell>{req.bloodGroup}</TableCell>
                      <TableCell>{req.quantity}</TableCell>
                      <TableCell className="capitalize">{req.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-3 mt-1">
            {recentRequests.length === 0 ? (
              <p className="text-center text-gray-500 text-base">
                No requests found.
              </p>
            ) : (
              recentRequests.map((req, i) => (
                <Card key={i} className="border p-3 shadow-sm text-sm rounded-lg">

                  <p className="text-lg font-bold text-red-600 text-center">
                    {req.hospital?.hospitalName || "Unknown Hospital"}
                  </p>

                  <p className="text-center text-gray-700 dark:text-gray-300 text-xs mb-2">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex justify-between px-1">
                    <p><strong>Blood:</strong> {req.bloodGroup}</p>
                    <p><strong>Units:</strong> {req.quantity}</p>
                  </div>

                  <div className="flex justify-between px-1 mt-1">
                    <p><strong>Status:</strong></p>
                    <p className="capitalize">{req.status}</p>
                  </div>

                </Card>
              ))
            )}
          </div>

        </CardContent>
      </Card>

    </div>
  );
}
