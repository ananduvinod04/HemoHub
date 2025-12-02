// src/pages/recipient/RecipientCreateRequest.jsx

import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Page Loading Animation
import Loader from "@/components/common/Loader";

// Submit Success Animation
import RecipientRequestSuccess from "@/components/common/RecipientRequestSuccess";

export default function RecipientCreateRequest() {
  const [hospitals, setHospitals] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [successOpen, setSuccessOpen] = useState(false);

  const [form, setForm] = useState({
    hospital: "",
    bloodGroup: "",
    quantity: "",
    requestType: "",
    emergencyReason: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/recipient/hospitals");
        setHospitals(res.data);
      } catch (err) {
        console.log("Error loading hospitals", err);
      } finally {
        setLoadingPage(false);
      }
    }
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();

    try {
      await api.post("/recipient/request", form);

      setForm({
        hospital: "",
        bloodGroup: "",
        quantity: "",
        requestType: "",
        emergencyReason: "",
      });

      setSuccessOpen(true);
    } catch (err) {
      alert("Failed to submit request");
    }
  }

  if (loadingPage)
    return (
     <div className="w-full h-screen flex items-center justify-center">
  <Loader size={80} />
</div>
    );

  return (
    <div className="w-full space-y-8">

      {/* HEADER */}
      <header className="px-4 py-6 bg-white dark:bg-gray-900 shadow-sm rounded-lg mt-4">
        <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">
          Request Blood
        </h2>
      </header>

      <div className="flex justify-center px-4">
        <Card className="w-full max-w-3xl shadow-md border">

          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Create Blood Request
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form className="space-y-8" onSubmit={submit}>

              {/* ROW 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Hospital */}
                <div className="space-y-1">
                  <Label>Select Hospital</Label>
                  <Select
                    value={form.hospital}
                    onValueChange={(v) => setForm({ ...form, hospital: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose hospital" />
                    </SelectTrigger>

                    <SelectContent>
                      {hospitals.map((h) => (
                        <SelectItem key={h._id} value={h._id}>
                          {h.hospitalName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Blood Group (DROPDOWN) */}
                <div className="space-y-1">
                  <Label>Blood Group</Label>
                  <Select
                    value={form.bloodGroup}
                    onValueChange={(v) =>
                      setForm({ ...form, bloodGroup: v })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>

                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (bg) => (
                          <SelectItem key={bg} value={bg}>
                            {bg}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ROW 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Quantity */}
                <div className="space-y-1">
                  <Label>Quantity (Units)</Label>
                  <Input
                    className="mt-1"
                    type="number"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: e.target.value })
                    }
                  />
                </div>

                {/* Request Type */}
                <div className="space-y-1">
                  <Label>Request Type</Label>
                  <Select
                    value={form.requestType}
                    onValueChange={(v) =>
                      setForm({ ...form, requestType: v })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Emergency Reason */}
              {form.requestType === "Emergency" && (
                <div className="space-y-1">
                  <Label>Emergency Reason</Label>
                  <Input
                    className="mt-1"
                    value={form.emergencyReason}
                    onChange={(e) =>
                      setForm({ ...form, emergencyReason: e.target.value })
                    }
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-red-600 text-white hover:bg-red-700"
              >
                Submit Request
              </Button>

            </form>
          </CardContent>

        </Card>
      </div>

      {/* SUCCESS POPUP */}
      <RecipientRequestSuccess
        open={successOpen}
        onOpenChange={setSuccessOpen}
      />

    </div>
  );
}
