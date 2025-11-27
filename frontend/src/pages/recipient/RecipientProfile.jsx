// src/pages/recipient/RecipientProfile.jsx
import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

export default function RecipientProfile() {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    email: "",
    bloodGroup: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await api.get("/recipient/profile");

      setProfile({
        name: res.data.data.name,
        age: res.data.data.age,
        email: res.data.data.email,
        bloodGroup: res.data.data.bloodGroup, // <-- used only for placeholder
      });
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

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Recipient Profile</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={update}>
          
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

          {/* Email (readonly) */}
          <div>
            <Label>Email</Label>
            <Input value={profile.email} disabled />
          </div>

          {/* Blood Group Dropdown */}
          <div>
            <Label>Blood Group</Label>
            <Select
              value={undefined}   // <--- forces placeholder display
              onValueChange={(val) =>
                setProfile({ ...profile, bloodGroup: val })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    profile.bloodGroup
                      ? `${profile.bloodGroup}`
                      : "Select blood group"
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

          {/* Save Button */}
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
  );
}
