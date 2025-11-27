import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HistoryTable from "./DonationHistoryTable";

export default function DonorDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Dashboard details
        const dash = await api.get("/donor/dashboard");
        setDashboard(dash.data);

        // Full history
        const h = await api.get("/donor/appointments/history");
        setHistory(h.data.appointments || []);
      } catch (err) {
        console.log("Dashboard Error:", err);
      }
    }

    loadData();
  }, []);

  if (!dashboard) return <p>Loading...</p>;

  const { totalAppointments, recentAppointments, eligibilityStatus, lastDonationDate } =
    dashboard;

  return (
    <div className="space-y-10">

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

            <div className="space-y-2">
              <p className="font-medium text-gray-700">Recent Appointments</p>

              {recentAppointments.length === 0 ? (
                <p className="text-sm text-gray-500">No recent appointments</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recentAppointments.map((appt, i) => (
                    <div key={i} className="p-2 border rounded-md bg-gray-50">
                      <p className="text-sm font-medium">{appt.hospitalName}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(appt.date).toLocaleDateString()} • {appt.type}
                      </p>
                      <p className="text-xs text-gray-500">Status: {appt.status}</p>
                    </div>
                  ))}
                </div>
              )}
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
