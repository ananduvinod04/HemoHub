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

  // Today's date (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  // Load hospitals
  useEffect(() => {
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
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    // ---- VALIDATION: Date Cannot Be in the Past ----
    if (!form.date) {
      toast.error("Please select a date!");
      return;
    }

    if (form.date < today) {
      toast.error("You cannot select a past date!");
      return;
    }

    setBooking(true);

    try {
      await api.post("/donor/appointment", form);

      // OPEN LOTTIE
      setSuccessOpen(true);

      // RESET FORM
      setForm({ hospitalName: "", type: "", date: "" });
    } catch (err) {
      console.log("Booking Error:", err);
      toast.error("Failed to book appointment.");
    } finally {
      setBooking(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="w-full space-y-8 mt-2 md:mt-6">

      {/* ---------------- Header Section ---------------- */}
      <header className="py-2 text-center mt-2 mb-1">
        <h1 className="text-3xl font-semibold text-red-600 dark:text-red-400">
          Book Appointment
        </h1>
      </header>

      {/* ---------------- Form Card ---------------- */}
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

                {/* ------------ HOSPITAL ------------ */}
                <div className="space-y-2">
                  <Label className="font-medium">Choose Hospital</Label>
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

                {/* ------------ TYPE ------------ */}
                <div className="space-y-2">
                  <Label className="font-medium">Appointment Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value) => setForm({ ...form, type: value })}
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

                {/* ------------ DATE ------------ */}
                <div className="space-y-2">
                  <Label className="font-medium">Select Date</Label>
                  <Input
                    type="date"
                    min={today}               // prevents selecting earlier days
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                  />
                </div>

              </div>

              {/* ------------ SUBMIT BUTTON ------------ */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={booking}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  {booking ? "Booking..." : "Book Appointment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* SUCCESS LOTTIE POPUP */}
      <BookingSuccess open={successOpen} onOpenChange={setSuccessOpen} />

    </div>
  );
}
