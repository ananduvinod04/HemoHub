
import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-base">Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{stats.totalDonors}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-base">Hospitals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalHospitals}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-base">Recipients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalRecipients}</p>
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
            <CardTitle className="text-base">Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.totalDonations}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
