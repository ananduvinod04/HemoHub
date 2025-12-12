import { useState, useEffect } from "react";
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

import Loader from "@/components/common/Loader";
import BloodStockAddedSuccess from "@/components/common/BloodStockAddedSuccess";

export default function AddBloodStock() {
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const [form, setForm] = useState({
    bloodGroup: "",
    units: "",
    expiryDate: "",
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true); // 🔥 dashboard-style loading
  const [successOpen, setSuccessOpen] = useState(false);

  // ---------------- PAGE LOADING (dashboard style) ----------------
  useEffect(() => {
    // Simulating initial page load
    setTimeout(() => setLoading(false), 500);
  }, []);

  // 🔥 Show dashboard-style centered loader
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-[60vh]">
        <Loader size={70} /> {/* Same feel as dashboard */}
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await api.post("/hospital/stock", {
        bloodGroup: form.bloodGroup,
        units: Number(form.units),
        expiryDate: form.expiryDate,
      });

      setSuccessOpen(true);

      setForm({ bloodGroup: "", units: "", expiryDate: "" });
    } catch (err) {
      console.error("Add stock error:", err);
      alert("Failed to add stock");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full space-y-6 mt-6 md:mt-8">

      {/* ---------------- HEADER ---------------- */}
     <header className="py-4 text-center">
        <h1 className="text-3xl font-semibold text-red-600 dark:text-red-400">
          Add Blood Stock
        </h1>
      </header>

      {/* ---------------- FORM CARD ---------------- */}
      <Card className="w-full border shadow-sm p-4 md:p-5">

        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-red-600">
            Update Blood Inventory
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ---------- ROW: Blood Group + Units + Expiry ---------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

              <div>
                <Label className="text-sm">Blood Group</Label>
                <Select
                  value={form.bloodGroup || undefined}
                  onValueChange={(val) =>
                    setForm({ ...form, bloodGroup: val })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select" />
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
                <Label className="text-sm">Units</Label>
                <Input
                  type="number"
                  className="h-9"
                  value={form.units}
                  onChange={(e) =>
                    setForm({ ...form, units: e.target.value })
                  }
                />
              </div>

              <div>
                <Label className="text-sm">Expiry Date</Label>
                <Input
                  type="date"
                  className="h-9"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm({ ...form, expiryDate: e.target.value })}
                />
              </div>

            </div>

            {/* ---------- SUBMIT BUTTON ---------- */}
            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-10"
            >
              {saving ? "Adding..." : "Add Stock"}
            </Button>

          </form>
        </CardContent>
      </Card>

      {/* SUCCESS POPUP */}
      <BloodStockAddedSuccess open={successOpen} onOpenChange={setSuccessOpen} />

    </div>
  );
}
