import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // <-- IMPORTANT
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminManageUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState("All");

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editValues, setEditValues] = useState({});

  // Load users from backend
  async function load() {
    try {
      const res = await api.get("/admin/users");

      const donors = (res.data.donors || []).map((u) => ({
        ...u,
        userType: "Donor",
      }));

      const hospitals = (res.data.hospitals || []).map((u) => ({
        ...u,
        userType: "Hospital",
      }));

      const recipients = (res.data.recipients || []).map((u) => ({
        ...u,
        userType: "Recipient",
      }));

      const merged = [...donors, ...hospitals, ...recipients];
      setAllUsers(merged);
      setFiltered(merged);

    } catch (err) {
      console.error("Load users error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Delete user
  async function removeUser(type, id) {
    if (!confirm("Delete this user?")) return;

    try {
      await api.delete(`/admin/delete/${type}/${id}`);
      load();
    } catch (err) {
      console.error("Delete user error:", err);
      alert("Failed to delete");
    }
  }

  // Open Edit Dialog
  function openEditModal(user) {
    setEditUser(user);

    setEditValues({
      name: user.name || user.hospitalName || "",
      email: user.email || "",
      bloodGroup: user.bloodGroup || "",
      age: user.age || "",
      address: user.address || "",
    });

    setEditOpen(true);
  }

  // Save Edit
  async function saveEdit() {
    const type = editUser.userType.toLowerCase(); // donor / hospital / recipient

    try {
      await api.put(`/admin/update/${type}/${editUser._id}`, editValues);
      setEditOpen(false);
      load();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update user");
    }
  }

  // Search + Filters
  useEffect(() => {
    let list = [...allUsers];

    if (search.trim()) {
      list = list.filter(
        (u) =>
          (u.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
          (u.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
          (u.hospitalName?.toLowerCase() || "").includes(search.toLowerCase())
      );
    }

    if (userType !== "All") {
      list = list.filter((u) => u.userType === userType);
    }

    setFiltered(list);
  }, [search, userType, allUsers]);

  if (loading) return <Loader className="h-12 w-12" />;

  return (
    <div className="p-6 space-y-6">

      {/* ---------------- HEADER ---------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">
            Manage Users
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* SEARCH */}
          <Input
            placeholder="Search by name, email, or hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* USER TYPE FILTER */}
          <Select value={userType} onValueChange={setUserType}>
            <SelectTrigger>
              <SelectValue placeholder="User Type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="All">All Users</SelectItem>
              <SelectItem value="Donor">Donor</SelectItem>
              <SelectItem value="Hospital">Hospital</SelectItem>
              <SelectItem value="Recipient">Recipient</SelectItem>
            </SelectContent>
          </Select>

        </CardContent>
      </Card>

      {/* ---------------- DESKTOP TABLE ---------------- */}
      <div className="hidden md:table w-full">
        <Table className="w-full">
          <TableCaption>All system users</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>User Type</TableHead>
              <TableHead>Name / Hospital</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((u) => (
              <TableRow
                key={u._id}
                className="hover:bg-white/10 hover:backdrop-blur-sm transition"
              >
                <TableCell>{u.userType}</TableCell>

                <TableCell>
                  {u.userType === "Hospital" ? u.hospitalName : u.name}
                </TableCell>

                <TableCell>{u.email}</TableCell>

                <TableCell>
                  {u.userType === "Hospital"
                    ? u.address
                    : u.age
                    ? `Age: ${u.age} | Blood: ${u.bloodGroup}`
                    : "-"}
                </TableCell>

                <TableCell className="space-x-2">
                  <Button size="sm" onClick={() => openEditModal(u)}>
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    className="bg-red-600 text-white"
                    onClick={() =>
                      removeUser(u.userType.toLowerCase(), u._id)
                    }
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ---------------- MOBILE CARD VIEW ---------------- */}
      {/* ---------------- MOBILE CARDS ---------------- */}
<div className="md:hidden space-y-4">
  {filtered.map((u) => (
    <Card
      key={u._id}
      className="
        p-4 shadow-md 
        hover:bg-white/10 hover:backdrop-blur-sm 
        transition duration-200
      "
    >
      <CardContent className="space-y-3">

        <h3 className="text-lg font-semibold">{u.userType}</h3>

        <p><strong>Name:</strong> {u.userType === "Hospital" ? u.hospitalName : u.name}</p>
        <p><strong>Email:</strong> {u.email}</p>

        {u.userType === "Hospital" ? (
          <p><strong>Address:</strong> {u.address}</p>
        ) : (
          <>
            <p><strong>Age:</strong> {u.age || "-"}</p>
            <p><strong>Blood Group:</strong> {u.bloodGroup || "-"}</p>
          </>
        )}

        {/* RESPONSIVE BUTTONS FIX */}
        <div className="flex flex-col sm:flex-row gap-2 pt-3 w-full">

          <Button
            size="sm"
            className="w-full"
            onClick={() => openEditModal(u)}
          >
            Edit
          </Button>

          <Button
            size="sm"
            className="w-full bg-red-600 text-white"
            onClick={() => removeUser(u.userType.toLowerCase(), u._id)}
          >
            Delete
          </Button>

        </div>
      </CardContent>
    </Card>
  ))}
</div>


      {/* ---------------- EDIT USER DIALOG ---------------- */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          {/* FORM */}
          <div className="space-y-4 mt-4">

            {/* NAME */}
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Enter name"
                value={editValues.name}
                onChange={(e) =>
                  setEditValues({ ...editValues, name: e.target.value })
                }
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                placeholder="Enter email"
                value={editValues.email}
                onChange={(e) =>
                  setEditValues({ ...editValues, email: e.target.value })
                }
              />
            </div>

            {/* SPECIAL FIELDS BASED ON USER TYPE */}

            {/* HOSPITAL */}
            {editUser?.userType === "Hospital" && (
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  placeholder="Enter address"
                  value={editValues.address}
                  onChange={(e) =>
                    setEditValues({
                      ...editValues,
                      address: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {/* DONOR / RECIPIENT */}
            {editUser?.userType !== "Hospital" && (
              <>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    placeholder="Enter age"
                    value={editValues.age}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        age: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Input
                    placeholder="Enter blood group"
                    value={editValues.bloodGroup}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        bloodGroup: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={saveEdit} className="bg-green-600 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
