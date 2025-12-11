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
import { toast } from "sonner";

export default function DonorProfile() {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    weight: "",
    email: "",
    bloodGroup: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get("/donor/profile");

        setProfile({
          name: res.data.name,
          age: res.data.age,
          weight: res.data.weight,
          email: res.data.email,
          bloodGroup: res.data.bloodGroup,
        });
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function updateProfile(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put("/donor/profile", {
        name: profile.name,
        age: profile.age,
        weight: profile.weight,
        bloodGroup: profile.bloodGroup,
      });

      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords do not match!");
    }

    try {
      await api.put("/donor/change-password", passwordForm);
      toast.success("Password updated!");

      setPasswordDialog(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error("Password update failed");
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
    <div className="w-full flex justify-center px-4 pb-6 mt-6">
      {/* MAIN PROFILE CARD */}
      <Card className="w-full max-w-4xl shadow-md border">

        {/* HEADER */}
        <CardHeader className="flex flex-col items-center py-6 space-y-4">

          <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 text-center">
            Donor Profile
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-sm text-center -mt-2">
            Manage your personal details securely
          </p>

          <Avatar className="h-24 w-24 mt-2">
            <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
            <AvatarFallback className="text-3xl">
              {profile.name?.[0] || "D"}
            </AvatarFallback>
          </Avatar>

        </CardHeader>

        {/* FORM */}
        <CardContent className="px-6 pb-8">
          <form className="space-y-8" onSubmit={updateProfile}>

            {/* ROW 1 */}
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

            {/* ROW 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={profile.email} disabled />
              </div>

              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  value={profile.weight}
                  onChange={(e) =>
                    setProfile({ ...profile, weight: e.target.value })
                  }
                />
              </div>

            </div>

            {/* ROW 3 */}
            <div className="space-y-2 md:w-1/2">
              <Label>Blood Group</Label>

              <Select
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

            {/* SAVE BUTTON */}
            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-red-600 text-white hover:bg-red-700"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>

            {/* CHANGE PASSWORD BUTTON */}
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

      {/* PASSWORD DIALOG */}
      <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Change Password
            </DialogTitle>
          </DialogHeader>

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
