// src/pages/recipient/RecipientProfile.jsx
import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ⭐ Your custom loading animation
import Loader from "@/components/common/Loader";

export default function RecipientProfile() {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    email: "",
    bloodGroup: "",
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true); // ⭐ PAGE LOADING STATE

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/recipient/profile");

        setProfile({
          name: res.data.data.name,
          age: res.data.data.age,
          email: res.data.data.email,
          bloodGroup: res.data.data.bloodGroup,
        });
      } catch (err) {
        console.log("Profile load error:", err);
      } finally {
        setLoading(false); // ⭐ STOP LOADING AFTER FETCH
      }
    }
    load();
  }, []);

  async function update(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put("/recipient/profile", {
        name: profile.name,
        age: profile.age,
        bloodGroup: profile.bloodGroup,
      });

      alert("Profile updated!");
    } catch (err) {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  }

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // ⭐ SHOW PAGE LOADING ANIMATION
  if (loading)
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
          Recipient Profile
        </h2>
      </header>

      <div className="flex justify-center px-4">
        <Card className="w-full max-w-3xl shadow-md border">

          {/* AVATAR */}
          <CardHeader className="flex flex-col items-center py-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
              <AvatarFallback className="text-3xl">
                {profile.name?.[0] || "R"}
              </AvatarFallback>
            </Avatar>

            <CardTitle className="text-xl font-semibold">
              Your Details
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form className="space-y-8" onSubmit={update}>

              {/* ROW 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input
                    className="mt-1"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label>Age</Label>
                  <Input
                    className="mt-1"
                    type="number"
                    value={profile.age}
                    onChange={(e) =>
                      setProfile({ ...profile, age: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* ROW 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input className="mt-1" value={profile.email} disabled />
                </div>

                <div className="space-y-1">
                  <Label>Blood Group</Label>
                  <Select
                    value={""}
                    onValueChange={(val) =>
                      setProfile({ ...profile, bloodGroup: val })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue
                        placeholder={
                          profile.bloodGroup || "Select blood group"
                        }
                      />
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

              </div>

              {/* SAVE BUTTON */}
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
    </div>
  );
}
