
import { useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AddBloodStock() {
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const [form, setForm] = useState({
    bloodGroup: "",
    units: "",
    expiryDate: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/hospital/stock", {
        bloodGroup: form.bloodGroup,
        units: Number(form.units),
        expiryDate: form.expiryDate,
      });
      alert("Blood stock added!");
      setForm({ bloodGroup: "", units: "", expiryDate: "" });
    } catch (err) {
      console.error("Add stock error:", err);
      alert("Failed to add stock");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add Blood Stock</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label>Blood Group</Label>
              <Select
                value={form.bloodGroup || undefined}
                onValueChange={(val) => setForm({ ...form, bloodGroup: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>

                <SelectContent>
                  {bloodGroups.map((bg) => (
                    <SelectItem key={bg} value={bg}>
                      {bg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Units</Label>
              <Input
                type="number"
                value={form.units}
                onChange={(e) => setForm({ ...form, units: e.target.value })}
              />
            </div>

            <div>
              <Label>Expiry Date</Label>
              <Input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full bg-red-600 text-white">
              {saving ? "Adding..." : "Add Stock"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
