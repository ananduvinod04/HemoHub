
import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HospitalDashboard() {
  const [stats, setStats] = useState({
    totalUnits: 0,
    totalAppointments: 0,
    totalRequests: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [stockRes, apptRes, reqRes] = await Promise.all([
          api.get("/hospital/stock"),
          api.get("/hospital/appointments"),
          api.get("/hospital/requests"),
        ]);

        const stock = stockRes.data || [];
        const totalUnits = stock.reduce((sum, s) => sum + (s.units || 0), 0);

        const appointments = apptRes.data || [];
        const requests = reqRes.data || [];

        const pending = requests.filter((r) => r.status === "Pending").length;

        setStats({
          totalUnits,
          totalAppointments: appointments.length,
          totalRequests: requests.length,
          pendingRequests: pending,
        });
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Hospital Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-base">Total Units</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{stats.totalUnits}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-base">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalAppointments}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-base">Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalRequests}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-base">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingRequests}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
