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
  SelectItem,
} from "@/components/ui/select";
import Loader from "@/components/common/Loader";
import BookingSuccess from "@/components/common/BookingSuccess";
import { toast } from "sonner";

export default function DonorBookAppointment() {
  const [hospitals, setHospitals] = useState([]);
  const [eligibility, setEligibility] = useState("Eligible");

  const [form, setForm] = useState({
    hospitalName: "",
    type: "",
    date: "",
  });

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Load hospitals + eligibility
  useEffect(() => {
    async function loadData() {
      try {
        const hospitalsRes = await api.get("/donor/hospitals");
        setHospitals(hospitalsRes.data);

        const dashRes = await api.get("/donor/dashboard");
        setEligibility(dashRes.data.eligibilityStatus);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (eligibility !== "Eligible") {
      toast.error("You are not eligible to donate at this time");
      return;
    }

    if (!form.date || form.date < today) {
      toast.error("Please select a valid future date");
      return;
    }

    setBooking(true);

    try {
      await api.post("/donor/appointment", form);
      setSuccessOpen(true);
      setForm({ hospitalName: "", type: "", date: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="w-full space-y-8 mt-4">

      {/* Header */}
      <h1 className="text-3xl font-semibold text-center text-red-600">
        Book Appointment
      </h1>

      <div className="flex justify-center">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-red-600">
              Fill Appointment Details
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Eligibility Warning */}
              {eligibility !== "Eligible" && (
                <div className="text-center text-sm text-red-500">
                  You are currently <b>NOT ELIGIBLE</b> to donate blood.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Hospital */}
                <div className="space-y-2">
                  <Label>Choose Hospital</Label>
                  <Select
                    value={form.hospitalName}
                    onValueChange={(value) =>
                      setForm({ ...form, hospitalName: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hospital" />
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

                {/* Type */}
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

                {/* Date */}
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
                disabled={booking || eligibility !== "Eligible"}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {eligibility !== "Eligible"
                  ? "Not Eligible to Donate"
                  : booking
                  ? "Booking..."
                  : "Book Appointment"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>

      <BookingSuccess open={successOpen} onOpenChange={setSuccessOpen} />
    </div>
  );
}
