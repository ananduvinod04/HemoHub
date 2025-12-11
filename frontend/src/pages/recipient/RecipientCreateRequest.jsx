

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

import Loader from "@/components/common/Loader";
import RecipientRequestSuccess from "@/components/common/RecipientRequestSuccess";
import { toast } from "sonner";

export default function RecipientCreateRequest() {
  const [hospitals, setHospitals] = useState([]);
  const [hospitalStock, setHospitalStock] = useState([]);

  const [loadingPage, setLoadingPage] = useState(true);
  const [successOpen, setSuccessOpen] = useState(false);

  const [form, setForm] = useState({
    hospital: "",
    bloodGroup: "",
    quantity: "",
    requestType: "",
    emergencyReason: "",
  });

  // Load hospital list
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

  // Load blood stock when a hospital is selected
  useEffect(() => {
    async function loadStock() {
      if (!form.hospital) return;
      try {
        const res = await api.get("/recipient/all-blood-stock");
        setHospitalStock(res.data);
      } catch (err) {
        console.log("Error loading stock", err);
      }
    }
    loadStock();
  }, [form.hospital]);

  // Helper → find available units for selected hospital + blood group
  function getAvailableUnits() {
    const stockItem = hospitalStock.find(
      (s) =>
        s.hospital?._id === form.hospital &&
        s.bloodGroup === form.bloodGroup
    );
    return stockItem ? stockItem.units : 0;
  }

  // Submit handler
  async function submit(e) {
    e.preventDefault();

    const available = getAvailableUnits();

    if (Number(form.quantity) > available) {
      return toast.error(
        `Cannot request ${form.quantity} units. Only ${available} units available.`
      );
    }

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
    <div className="w-full space-y-6 px-3 pb-6">

      {/* HEADER */}
      <header className="py-2 text-center mt-2 mb-1">
        <h1 className="text-3xl font-semibold text-red-600 dark:text-red-400">
          Request Blood
        </h1>
      </header>

      <div className="flex justify-center px-2">
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
                <div className="space-y-2">
                  <Label>Select Hospital</Label>
                  <Select
                    value={form.hospital}
                    onValueChange={(v) => setForm({ ...form, hospital: v })}
                  >
                    <SelectTrigger>
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

                {/* Blood Group */}
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select
                    value={form.bloodGroup}
                    onValueChange={(v) =>
                      setForm({ ...form, bloodGroup: v })
                    }
                  >
                    <SelectTrigger>
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
                <div className="space-y-2">
                  <Label>Quantity (Units)</Label>
                  <Input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      const available = getAvailableUnits();

                      if (qty > available) {
                        toast.error(
                          `Only ${available} units available.`
                        );
                      }

                      setForm({ ...form, quantity: qty });
                    }}
                  />
                </div>

                {/* Request Type */}
                <div className="space-y-2">
                  <Label>Request Type</Label>
                  <Select
                    value={form.requestType}
                    onValueChange={(v) =>
                      setForm({ ...form, requestType: v })
                    }
                  >
                    <SelectTrigger>
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
                <div className="space-y-2">
                  <Label>Emergency Reason</Label>
                  <Input
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
