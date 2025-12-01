import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Loader from "@/components/common/Loader";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log("Update Error:", error);
      toast.error("Failed to update profile.");
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
          Your Profile
        </h2>
      </header>

      {/* ---------------- PROFILE CARD ---------------- */}
      <div className="w-full flex justify-center">
        <Card className="w-full max-w-3xl border shadow-sm">

          <CardHeader>
            <CardTitle className="text-xl font-semibold text-red-600">
              Edit Your Details
            </CardTitle>
          </CardHeader>

          <CardContent>

            {/* Avatar centered */}
            <div className="flex flex-col items-center mb-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="https://randomuser.me/api/portraits/men/75.jpg" />
                <AvatarFallback>{profile.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>

            {/* ---------------- FORM ---------------- */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* NAME FIELD – full width */}
              <div>
                <Label>Name</Label>
                <Input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </div>

              {/* AGE + WEIGHT – same row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              {/* BLOOD GROUP (can go inline if more fields added) */}
              <div className="md:w-1/2">
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

              {/* SUBMIT BUTTON */}
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
      </div>

    </div>
  );
}
