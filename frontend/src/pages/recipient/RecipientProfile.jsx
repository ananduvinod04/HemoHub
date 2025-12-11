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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loader from "@/components/common/Loader";

export default function RecipientProfile() {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    email: "",
    bloodGroup: "",
    medicalCondition: "",
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/recipient/profile");

        setProfile({
          name: res.data.data.name,
          age: res.data.data.age,
          email: res.data.data.email,
          bloodGroup: res.data.data.bloodGroup,
          medicalCondition: res.data.data.medicalCondition || "",
        });
      } catch (err) {
        console.log("Profile load error:", err);
      } finally {
        setLoading(false);
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
        medicalCondition: profile.medicalCondition,
      });

      alert("Profile updated!");
    } catch (err) {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      await api.put("/recipient/change-password", passwordForm);
      alert("Password updated successfully!");

      setPasswordDialog(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert("Password update failed!");
    }
  }

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader size={80} />
      </div>
    );

  return (
    <div className="w-full flex justify-center px-4 pb-6">

      {/* MAIN PROFILE CARD WITH HEADER INSIDE */}
      <Card className="w-full max-w-4xl shadow-md border">

        {/* HEADER INSIDE CARD */}
        <CardHeader className="flex flex-col items-center py-6 space-y-4">

          <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 text-center">
            Recipient Profile
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-sm text-center -mt-2">
            Manage your personal details securely
          </p>

          {/* AVATAR */}
          <Avatar className="h-24 w-24 mt-2">
            <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
            <AvatarFallback className="text-3xl">
              {profile.name?.[0] || "R"}
            </AvatarFallback>
          </Avatar>

        </CardHeader>

        {/* FORM */}
        <CardContent className="px-6 pb-8">
          <form className="space-y-8" onSubmit={update}>

            {/* ---- ROW 1 ---- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Age</Label>
                <Input
                  type="number"
                  value={profile.age}
                  onChange={(e) =>
                    setProfile({ ...profile, age: e.target.value })
                  }
                />
              </div>

            </div>

            {/* ---- ROW 2 ---- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={profile.email} disabled />
              </div>

              <div className="space-y-2">
                <Label>Blood Group</Label>
                <Select
                  value=""
                  onValueChange={(val) =>
                    setProfile({ ...profile, bloodGroup: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={profile.bloodGroup || "Select blood group"} />
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

            {/* ---- ROW 3 ---- */}
            <div className="space-y-2">
              <Label>Medical Condition (optional)</Label>
              <Input
                value={profile.medicalCondition}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    medicalCondition: e.target.value,
                  })
                }
              />
            </div>

            {/* ---- SAVE BUTTON ---- */}
            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-red-600 text-white hover:bg-red-700"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>

            {/* ---- CHANGE PASSWORD BUTTON ---- */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-red-500 text-red-600 hover:bg-red-50"
              onClick={() => setPasswordDialog(true)}
            >
              Change Password
            </Button>

          </form>
        </CardContent>
      </Card>

      {/* ------------ PASSWORD CHANGE DIALOG ------------ */}
      <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Change Password
            </DialogTitle>
          </DialogHeader>

          {/* DIALOG FORM FIELDS WITH CORRECT SPACING */}
          <div className="space-y-4 py-4">

            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

          </div>

          <DialogFooter>
            <Button
              className="w-full bg-red-600 text-white hover:bg-red-700"
              onClick={changePassword}
            >
              Update Password
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>

    </div>
  );
}
