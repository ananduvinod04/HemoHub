import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DonorProfile() {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    weight: "",
    bloodGroup: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch profile from backend
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/donor/profile");
        setProfile(res.data);
      } catch (error) {
        console.log("Profile Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/donor/profile", profile);
      alert("Profile updated successfully!");
    } catch (error) {
      console.log("Update Error:", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading profile...</p>;

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

          {/* Blood Group */}
          <div>
            <Label>Blood Group</Label>
            <Input
              value={profile.bloodGroup}
              onChange={(e) =>
                setProfile({ ...profile, bloodGroup: e.target.value })
              }
            />
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
