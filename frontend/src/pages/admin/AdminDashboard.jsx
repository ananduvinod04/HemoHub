import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Loader from "@/components/common/Loader";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalHospitals: 0,
    totalRecipients: 0,
    totalRequests: 0,
    totalDonations: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/admin/dashboard");
        const d = res.data.data || {};

        setStats({
          totalDonors: d.totalDonors || 0,
          totalHospitals: d.totalHospitals || 0,
          totalRecipients: d.totalRecipients || 0,
          totalRequests: d.totalRequests || 0,
          totalDonations: d.totalDonations || 0,
        });
      } catch (err) {
        console.error("Admin dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader className="h-12 w-12" />;

  // ---------------- CHART DATA ---------------- //
  const userData = [
    { name: "Donors", value: stats.totalDonors },
    { name: "Hospitals", value: stats.totalHospitals },
    { name: "Recipients", value: stats.totalRecipients },
  ];

  const activityData = [
    { name: "Requests", value: stats.totalRequests },
    { name: "Donations", value: stats.totalDonations },
  ];

  const COLORS = ["#ef4444", "#3b82f6", "#10b981"];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>

      {/* ----------- TOP STATS CARDS ----------- */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-sm">Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{stats.totalDonors}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-sm">Hospitals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalHospitals}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-sm">Recipients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalRecipients}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-sm">Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalRequests}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-sm">Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.totalDonations}</p>
          </CardContent>
        </Card>
      </div>

      {/* ----------- CHART SECTION ----------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* -------- PIE CHART: USER DISTRIBUTION -------- */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">User Distribution</CardTitle>
          </CardHeader>

          <CardContent className="h-64">
            <ChartContainer
              config={{
                Donors: { label: "Donors", color: "#ef4444" },
                Hospitals: { label: "Hospitals", color: "#3b82f6" },
                Recipients: { label: "Recipients", color: "#10b981" },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    label
                  >
                    {userData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>

                  <ChartLegend />
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* -------- BAR CHART: REQUESTS VS DONATIONS -------- */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Requests vs Donations</CardTitle>
          </CardHeader>

          <CardContent className="h-64">
            <ChartContainer
              config={{
                Requests: { label: "Requests", color: "#ef4444" },
                Donations: { label: "Donations", color: "#10b981" },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip />

                  <Bar
                    dataKey="value"
                    fill="#ef4444"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
