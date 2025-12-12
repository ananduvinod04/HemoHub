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

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Loader from "@/components/common/Loader";
import { Hospital } from "lucide-react";
import { toast } from "sonner";

export default function HospitalProfile() {
  const [profile, setProfile] = useState({
    hospitalName: "",
    email: "",
    licenseNumber: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Password dialog state
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load hospital data
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
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Update profile
  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put("/hospital/profile", {
        hospitalName: profile.hospitalName,
        address: profile.address
      });

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  }

  // Change password
  async function changePassword() {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords do not match!");
    }

    try {
      await api.put("/hospital/change-password", passwordForm);

      toast.success("Password updated!");
      setPasswordDialog(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error("Password update failed!");
    }
  }

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader size={80} />
      </div>
    );

  return (
    <div className="w-full flex justify-center px-4 pb-6 mt-6">

      <Card className="w-full max-w-4xl shadow-md border">

        {/* HEADER */}
        <CardHeader className="flex flex-col items-center py-6 space-y-4">
          <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 text-center">
            Hospital Profile
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-sm text-center -mt-2">
            Manage your hospital details securely
          </p>

          {/* Avatar */}
          <Avatar className="h-24 w-24 bg-red-50 border shadow-sm mt-2">
            <AvatarFallback className="text-red-600 flex items-center justify-center">
              <Hospital className="w-14 h-14" />
            </AvatarFallback>
          </Avatar>
        </CardHeader>

        {/* FORM */}
        <CardContent className="px-6 pb-8">
          <form onSubmit={handleUpdate} className="space-y-8">

            {/* ROW 1: Hospital Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="space-y-2">
                <Label>Hospital Name</Label>
                <Input
                  value={profile.hospitalName}
                  onChange={(e) =>
                    setProfile({ ...profile, hospitalName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Email (readonly)</Label>
                <Input value={profile.email} disabled />
              </div>

            </div>

            {/* ROW 2: License Number + Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="space-y-2">
                <Label>License Number (readonly)</Label>
                <Input value={profile.licenseNumber} disabled />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                />
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
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
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
