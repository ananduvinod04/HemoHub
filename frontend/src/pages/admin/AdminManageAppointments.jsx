import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Loader from "@/components/common/Loader";

export default function AdminManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [hospitalFilter, setHospitalFilter] = useState("All");

  const [hospitals, setHospitals] = useState([]);

  const getHospitals = async () => {
    try {
      const res = await api.get("/recipient/hospitals", { withCredentials: true });
      setHospitals(res.data);
    } catch (err) {
      console.error("Hospital fetch error:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/admin/requests", { withCredentials: true });
      setAppointments(res.data.data);
      setFiltered(res.data.data);
    } catch (err) {
      console.error("Appointment fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    getHospitals();
  }, []);

  useEffect(() => {
    let list = [...appointments];

    if (search.trim() !== "") {
      list = list.filter((a) =>
        a.recipient?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      list = list.filter((a) => a.status === statusFilter);
    }

    if (hospitalFilter !== "All") {
      list = list.filter((a) => a.hospital?.hospitalName === hospitalFilter);
    }

    setFiltered(list);
  }, [search, statusFilter, hospitalFilter, appointments]);

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await api.put(`/admin/appointment/${id}`, { status: newStatus }, { withCredentials: true });
      fetchAppointments();
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusColor = {
    Pending: "bg-yellow-500",
    Approved: "bg-blue-600",
    Completed: "bg-green-600",
    Cancelled: "bg-red-600",
  };

  // --- Same loading logic as Dashboard ---
  if (loading) return <Loader className="h-12 w-12" />;

  return (
    <div className="p-6">

      {/* PAGE HEADER */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">
            Manage Appointments
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              placeholder="Search donor name..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* STATUS FILTER */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* HOSPITAL FILTER */}
          <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Hospital" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Hospitals</SelectItem>
              {hospitals.map((h) => (
                <SelectItem key={h._id} value={h.hospitalName}>
                  {h.hospitalName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* ------------------ DESKTOP TABLE VIEW ------------------ */}
      <Card className="hidden md:block">
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Donor</th>
                <th className="p-3 text-left">Hospital</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((ap) => (
                <tr
                  key={ap._id}
                  className="
                    border-b 
                    hover:bg-white/10 
                    dark:hover:bg-white/10 
                    hover:backdrop-blur-sm 
                    transition-all 
                    duration-200
                  "
                >
                  <td className="p-3">{ap.recipient?.name}</td>
                  <td className="p-3">{ap.hospital?.hospitalName}</td>
                  <td className="p-3">{ap.type}</td>
                  <td className="p-3">{new Date(ap.createdAt).toLocaleDateString()}</td>

                  <td className="p-3">
                    <Badge className={`${statusColor[ap.status]} text-white`}>
                      {ap.status}
                    </Badge>
                  </td>

                  <td className="p-3 space-x-2">
                    <Button
                      className="bg-blue-600 text-white"
                      disabled={updatingId === ap._id}
                      onClick={() => updateStatus(ap._id, "Approved")}
                    >
                      Approve
                    </Button>

                    <Button
                      className="bg-green-600 text-white"
                      disabled={updatingId === ap._id}
                      onClick={() => updateStatus(ap._id, "Completed")}
                    >
                      Complete
                    </Button>

                    <Button
                      className="bg-red-600 text-white"
                      disabled={updatingId === ap._id}
                      onClick={() => updateStatus(ap._id, "Cancelled")}
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ------------------ MOBILE CARD VIEW ------------------ */}
      <div className="md:hidden space-y-4">
        {filtered.map((ap) => (
          <Card
            key={ap._id}
            className="
              shadow-md 
              hover:bg-white/10 
              hover:backdrop-blur-sm 
              dark:hover:bg-white/10
              transition-all 
              duration-200
            "
          >
            <CardContent className="p-4 space-y-3">

              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{ap.recipient?.name}</h2>
                <Badge className={`${statusColor[ap.status]} text-white`}>
                  {ap.status}
                </Badge>
              </div>

              <p className="text-sm">
                <span className="font-semibold">Hospital:</span>{" "}
                {ap.hospital?.hospitalName}
              </p>

              <p className="text-sm">
                <span className="font-semibold">Type:</span> {ap.type}
              </p>

              <p className="text-sm">
                <span className="font-semibold">Date:</span>{" "}
                {new Date(ap.createdAt).toLocaleDateString()}
              </p>

              <div className="flex flex-col space-y-2 pt-3">
                <Button
                  className="bg-blue-600 text-white w-full"
                  disabled={updatingId === ap._id}
                  onClick={() => updateStatus(ap._id, "Approved")}
                >
                  Approve
                </Button>

                <Button
                  className="bg-green-600 text-white w-full"
                  disabled={updatingId === ap._id}
                  onClick={() => updateStatus(ap._id, "Completed")}
                >
                  Complete
                </Button>

                <Button
                  className="bg-red-600 text-white w-full"
                  disabled={updatingId === ap._id}
                  onClick={() => updateStatus(ap._id, "Cancelled")}
                >
                  Cancel
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
