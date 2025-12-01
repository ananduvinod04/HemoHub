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
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Loader from "@/components/common/Loader";


export default function DonorAppointmentHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointment history
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await api.get("/donor/appointments/history");
        setHistory(res.data.appointments || []);
      } catch (error) {
        console.log("History Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (loading) return <Loader size={64} className="mt-20" />;

  return (
    <div className="w-full">
      <Card className="w-full shadow-sm border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-red-600">
            Appointment History
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableCaption>Your complete blood donation appointment history.</TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>Hospital</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    You have no past appointments.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((appt, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{appt.hospitalName}</TableCell>
                    <TableCell>{appt.type}</TableCell>
                    <TableCell>{new Date(appt.date).toLocaleDateString()}</TableCell>
                    <TableCell className="capitalize">{appt.status}</TableCell>
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
