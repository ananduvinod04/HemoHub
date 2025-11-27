
import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
        // hospital controller returns hospital object directly
        setProfile({
          hospitalName: data.hospitalName || data.hospitalName || data.hospitalName,
          email: data.email,
          licenseNumber: data.licenseNumber,
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
        password: profile.password || undefined,
      });
      alert("Profile updated!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading profile...</p>;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Hospital Profile</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Hospital Name</Label>
            <Input
              value={profile.hospitalName}
              onChange={(e) => setProfile({ ...profile, hospitalName: e.target.value })}
            />
          </div>

          <div>
            <Label>Email (readonly)</Label>
            <Input value={profile.email} disabled />
          </div>

          <div>
            <Label>License Number (readonly)</Label>
            <Input value={profile.licenseNumber} disabled />
          </div>

          <div>
            <Label>Address</Label>
            <Input
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
          </div>

          <div>
            <Label>New Password (optional)</Label>
            <Input
              type="password"
              value={profile.password || ""}
              onChange={(e) => setProfile({ ...profile, password: e.target.value })}
            />
          </div>

          <Button type="submit" disabled={saving} className="w-full bg-red-600 text-white">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
