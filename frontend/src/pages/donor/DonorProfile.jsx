import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Loader from "@/components/common/Loader";


export default function DonorProfile() {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    weight: "",
    bloodGroup: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/donor/profile");
        setProfile(res.data);
      } catch (error) {
        console.log("Profile Fetch Error:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Submit handler
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/donor/profile", profile);

      //  SUCCESS TOAST
      toast.success("Profile updated successfully!");

    } catch (error) {
      console.log("Update Error:", error);

      //  ERROR TOAST
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader size={64} className="mt-20" />;

  return (
    <Card className="max-w-xl border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Your Profile</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />
          </div>

          {/* Age */}
          <div>
            <Label>Age</Label>
            <Input
              type="number"
              value={profile.age}
              onChange={(e) =>
                setProfile({ ...profile, age: e.target.value })
              }
            />
          </div>

          {/* Weight */}
          <div>
            <Label>Weight</Label>
            <Input
              type="number"
              value={profile.weight}
              onChange={(e) =>
                setProfile({ ...profile, weight: e.target.value })
              }
            />
          </div>

          {/* Blood Group – DROPDOWN */}
          <div>
            <Label>Blood Group</Label>
            <select
              className="border p-2 rounded w-full"
              value={profile.bloodGroup}
              onChange={(e) =>
                setProfile({ ...profile, bloodGroup: e.target.value })
              }
            >
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-red-600 text-white hover:bg-red-700"
          >
            {saving ? "Saving..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
