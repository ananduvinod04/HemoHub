import { useState, useEffect } from "react";
import api from "@/api/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import Loader from "@/components/common/Loader";
import BookingSuccess from "@/components/common/BookingSuccess";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export default function DonorBookAppointment() {
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState({
    hospitalName: "",
    type: "",
    date: "",
  });

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const user = useAuthStore((state) => state.user);

  // eligibility flag (adjust field name if different)
  const isEligible = user?.eligible === true;

  // Today's date (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  // Load hospitals ONLY if eligible
  useEffect(() => {
    if (!isEligible) {
      setLoading(false);
      return;
    }

    async function fetchHospitals() {
      try {
        const res = await api.get("/donor/hospitals");
        setHospitals(res.data);
      } catch (err) {
        console.log("Error fetching hospitals:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHospitals();
  }, [isEligible]);

  async function handleSubmit(e) {
    e.preventDefault();

    // 🔒 Extra protection
    if (!isEligible) {
      toast.error("You are not eligible to book an appointment right now.");
      return;
    }

    if (!form.hospitalName || !form.type || !form.date) {
      toast.error("Please fill all required fields");
      return;
    }

    if (form.date < today) {
      toast.error("You cannot select a past date!");
      return;
    }

    setBooking(true);

    try {
      await api.post("/donor/appointment", form);

      setSuccessOpen(true);
      setForm({ hospitalName: "", type: "", date: "" });
    } catch (err) {
      console.log("Booking Error:", err);
      toast.error(
        err.response?.data?.message || "Failed to book appointment."
      );
    } finally {
      setBooking(false);
    }
  }

  // ---------------- LOADING ----------------
  if (loading) return <Loader />;

  // ---------------- NOT ELIGIBLE UI ----------------
  if (!isEligible) {
    return (
      <div className="flex justify-center mt-16 px-4">
        <Card className="max-w-lg w-full p-6 text-center border-red-200 dark:border-red-400">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
            You are not eligible to donate
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            You cannot book an appointment until your eligibility period
            is completed. Please try again later.
          </p>
        </Card>
      </div>
    );
  }

  // ---------------- MAIN FORM ----------------
  return (
    <div className="w-full space-y-8 mt-2 md:mt-6">
      <header className="py-2 text-center">
        <h1 className="text-3xl font-semibold text-red-600 dark:text-red-400">
          Book Appointment
        </h1>
      </header>

      <div className="w-full flex justify-center">
        <Card className="w-full max-w-4xl shadow-sm border">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-red-600">
              Fill Appointment Details
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* HOSPITAL */}
                <div className="space-y-2">
                  <Label>Choose Hospital</Label>
                  <Select
                    value={form.hospitalName}
                    onValueChange={(value) =>
                      setForm({ ...form, hospitalName: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a hospital" />
                    </SelectTrigger>
                    <SelectContent>
                      {hospitals.map((h) => (
                        <SelectItem key={h._id} value={h.hospitalName}>
                          {h.hospitalName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* TYPE */}
                <div className="space-y-2">
                  <Label>Appointment Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value) =>
                      setForm({ ...form, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Donation">Donation</SelectItem>
                      <SelectItem value="Blood Test">Blood Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* DATE */}
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Input
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={booking}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {booking ? "Booking..." : "Book Appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <BookingSuccess open={successOpen} onOpenChange={setSuccessOpen} />
    </div>
  );
}
