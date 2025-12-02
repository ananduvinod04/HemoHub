import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Hospital } from "lucide-react";

export default function HospitalProfile() {
  const [profile, setProfile] = useState({
    hospitalName: "",
    email: "",
    licenseNumber: "",
    address: "",
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/hospital/profile");
        const data = res.data;

        setProfile({
          hospitalName: data.hospitalName || "",
          email: data.email || "",
          licenseNumber: data.licenseNumber || "",
          address: data.address || "",
        });
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put("/hospital/profile", {
        hospitalName: profile.hospitalName,
        address: profile.address,
      });

      alert("Profile updated!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader size={64} className="mt-20" />;

  return (
    <div className="w-full space-y-8 mt-2 md:mt-8">

      {/* ---------------- HEADER ---------------- */}
      <header className="px-4 py-4 bg-white dark:bg-gray-900 shadow-sm rounded-lg">
        <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">
          Hospital Profile
        </h2>
      </header>

      {/* ---------------- FULL WIDTH FORM CARD ---------------- */}
      <Card className="w-full border shadow-sm p-4 md:p-6">

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6 mt-4">
          <Avatar className="w-28 h-28 border shadow-sm bg-red-50">
            <AvatarFallback className="bg-red-100 flex items-center justify-center">
              <Hospital className="w-14 h-14 text-red-600" />
            </AvatarFallback>
          </Avatar>

          <p className="mt-3 text-xl font-semibold text-gray-800 dark:text-gray-100">
            {profile.hospitalName}
          </p>
        </div>

        {/* ---------------- FORM ---------------- */}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* -------- ROW 1: Hospital Name (full width) -------- */}
            <div className="w-full">
              <Label>Hospital Name</Label>
              <Input
                value={profile.hospitalName}
                onChange={(e) => setProfile({ ...profile, hospitalName: e.target.value })}
                className="w-full"
              />
            </div>

            {/* -------- ROW 2: Email + License Number -------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="w-full">
                <Label>Email (readonly)</Label>
                <Input value={profile.email} disabled className="w-full" />
              </div>

              <div className="w-full">
                <Label>License Number (readonly)</Label>
                <Input value={profile.licenseNumber} disabled className="w-full" />
              </div>

            </div>

            {/* -------- ROW 3: Address (full width) -------- */}
            <div className="w-full">
              <Label>Address</Label>
              <Input
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full"
              />
            </div>

            {/* -------- SUBMIT BUTTON -------- */}
            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-red-600 text-white hover:bg-red-700"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>

          </form>
        </CardContent>

      </Card>
    </div>
  );
}
