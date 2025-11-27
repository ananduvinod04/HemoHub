// src/pages/recipient/RecipientCreateRequest.jsx
import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function RecipientCreateRequest() {
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState({
    hospital: "",
    bloodGroup: "",
    quantity: "",
    requestType: "",
    emergencyReason: "",
  });

  useEffect(() => {
    async function load() {
      const res = await api.get("/recipient/hospitals");
      setHospitals(res.data);
    }
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();

    try {
      await api.post("/recipient/request", form);
      alert("Request submitted!");
      setForm({ hospital: "", bloodGroup: "", quantity: "", requestType: "", emergencyReason: "" });
    } catch (err) {
      alert("Failed to submit request");
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Request Blood</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={submit}>

          {/* Hospital */}
          <div>
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
          <div>
            <Label>Blood Group</Label>
            <Input
              value={form.bloodGroup}
              onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
            />
          </div>

          {/* Quantity */}
          <div>
            <Label>Quantity (Units)</Label>
            <Input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </div>

          {/* Type */}
          <div>
            <Label>Request Type</Label>
            <Select
              value={form.requestType}
              onValueChange={(v) => setForm({ ...form, requestType: v })}
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

          {/* Emergency Reason */}
          {form.requestType === "Emergency" && (
            <div>
              <Label>Emergency Reason</Label>
              <Input
                value={form.emergencyReason}
                onChange={(e) =>
                  setForm({ ...form, emergencyReason: e.target.value })
                }
              />
            </div>
          )}

          <Button type="submit" className="w-full bg-red-600 text-white">
            Submit Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
