import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

import Loader from "@/components/common/Loader";

export default function HospitalDashboard() {
  const [profile, setProfile] = useState(null);

  const [stats, setStats] = useState({
    totalUnits: 0,
    totalAppointments: 0,
    totalRequests: 0,
    pendingRequests: 0,
  });

  const [stockData, setStockData] = useState([]);
  const [overallSummary, setOverallSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------- FETCH ALL DATA ----------
  useEffect(() => {
    async function load() {
      try {
        // Fetch dashboard data
        const [stockRes, apptRes, reqRes, profRes] = await Promise.all([
          api.get("/hospital/stock"),
          api.get("/hospital/appointments"),
          api.get("/hospital/requests"),
          api.get("/hospital/profile"),
        ]);

        // SET HOSPITAL PROFILE
        setProfile(profRes.data);

        const stock = stockRes.data || [];
        const appointments = apptRes.data || [];
        const requests = reqRes.data || [];

        const totalUnits = stock.reduce((sum, s) => sum + (s.units || 0), 0);
        const pendingRequests = requests.filter((r) => r.status === "Pending").length;

        // ---- BLOOD GROUP STOCK PIE DATA ----
        const groupedStock = stock.reduce((acc, s) => {
          acc[s.bloodGroup] = (acc[s.bloodGroup] || 0) + s.units;
          return acc;
        }, {});

        const stockFormatted = Object.entries(groupedStock).map(([bg, units]) => ({
          bloodGroup: bg,
          units,
        }));

        // ---- OVERALL SUMMARY PIE ----
        const summaryPie = [
          { name: "Appointments", value: appointments.length, color: "#dc2626" },
          { name: "Requests", value: requests.length, color: "#f87171" },
          { name: "Pending", value: pendingRequests, color: "#eab308" },
        ];

        setStats({
          totalUnits,
          totalAppointments: appointments.length,
          totalRequests: requests.length,
          pendingRequests,
        });

        setStockData(stockFormatted);
        setOverallSummary(summaryPie);
      } catch (err) {
        console.log("Dashboard load error", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <Loader size={64} className="mt-20" />;

  // ---------- BLOOD COLOR SCHEME ----------
  const BLOOD_COLORS = {
    "A+": "#b91c1c",
    "A-": "#fca5a5",
    "B+": "#1d4ed8",
    "B-": "#93c5fd",
    "O+": "#047857",
    "O-": "#6ee7b7",
    "AB+": "#7c3aed",
    "AB-": "#c4b5fd",
  };

  return (
    <div className="space-y-10 mt-6 md:mt-8">

      {/* ---------- HEADER ---------- */}
      <header className="py-2 text-center mt-2 mb-1">
        <h1 className="text-3xl font-semibold text-red-600 dark:text-red-400">
          Hospital Dashboard
        </h1>

        {/* Display Logged-in Hospital Name */}
        <p className="text-base text-gray-700 dark:text-gray-300 mt-1">
          Welcome,{" "}
          <span className="font-semibold">
            {profile?.hospitalName}
          </span>{" "}
          👋
        </p>
      </header>

      {/* ---------- TOP STAT CARDS ---------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">

        <Card className="shadow-sm border text-center">
          <CardHeader>
            <CardTitle>Total Units</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-red-600 font-bold">{stats.totalUnits}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border text-center">
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalAppointments}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border text-center">
          <CardHeader>
            <CardTitle>Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalRequests}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border text-center">
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-yellow-600 font-bold">
              {stats.pendingRequests}
            </p>
          </CardContent>
        </Card>

      </div>

      {/* ---------- CHARTS SECTION ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">

        {/* ---------- BLOOD STOCK PIE ---------- */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Blood Group Distribution
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-64 md:h-72 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockData}
                    dataKey="units"
                    nameKey="bloodGroup"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {stockData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={BLOOD_COLORS[entry.bloodGroup]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* LEGEND */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              {stockData.map((bg) => (
                <div key={bg.bloodGroup} className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: BLOOD_COLORS[bg.bloodGroup] }}
                  ></span>
                  <span className="font-medium">{bg.bloodGroup}:</span>
                  <span>{bg.units}</span>
                </div>
              ))}
            </div>

          </CardContent>
        </Card>

        {/* ---------- OVERALL SUMMARY PIE ---------- */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Overall Activity Summary
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-64 md:h-72 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overallSummary}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {overallSummary.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* LEGEND */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {overallSummary.map((row) => (
                <div key={row.name} className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: row.color }}
                  ></span>
                  <span className="font-medium">{row.name}:</span>
                  <span>{row.value}</span>
                </div>
              ))}
            </div>

          </CardContent>
        </Card>

      </div>

    </div>
  );
}
