import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HistoryTable from "./DonationHistoryTable";
import { useAuthStore } from "@/store/authStore";   // 👈 added

export default function DonorDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [history, setHistory] = useState([]);

  const user = useAuthStore((state) => state.user);  // 👈 get logged-in user

  useEffect(() => {
    async function loadData() {
      try {
        const dash = await api.get("/donor/dashboard");
        setDashboard(dash.data);

        const h = await api.get("/donor/appointments/history");
        setHistory(h.data.appointments || []);
      } catch (err) {
        console.log("Dashboard Error:", err);
      }
    }

    loadData();
  }, []);

  if (!dashboard) return <p>Loading...</p>;

  const { totalAppointments, eligibilityStatus, lastDonationDate } = dashboard;

  return (
    <div className="space-y-10 py-2">

      {/* ----------------- Top Right Name ----------------- */}
     {/* ----------------- Dashboard Heading + Name ----------------- */}
<div className="flex items-center justify-between px-2">

  {/* LEFT — Dashboard Title */}
  <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">
    Dashboard
  </h2>

  {/* RIGHT — Welcome User */}
  <p className="text-lg font-semibold text-gray-700 dark:text-gray-100">
    Welcome, {user?.name}
  </p>
</div>

      {/* ----------------- Dashboard Tiles ----------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* TILE 1 */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Your Appointment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-red-600">{totalAppointments}</p>
              <p className="text-gray-600">Total Appointments</p>
            </div>
          </CardContent>
        </Card>

        {/* TILE 2 */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Donation Eligibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <p
                className={`text-3xl font-bold ${
                  eligibilityStatus === "Eligible" ? "text-green-600" : "text-red-600"
                }`}
              >
                {eligibilityStatus}
              </p>
              <p className="text-gray-600">Current Status</p>
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-sm">Last Donation Date</p>
              <p className="font-medium">
                {lastDonationDate
                  ? new Date(lastDonationDate).toLocaleDateString()
                  : "No previous donation"}
              </p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ----------------- FULL HISTORY TABLE ----------------- */}
      <HistoryTable history={history} />
    </div>
  );
}
