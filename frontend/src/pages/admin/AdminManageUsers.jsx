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
import { Label } from "@/components/ui/label";

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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ⭐ Alert Dialog
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// ⭐ Lucide Icons
import { PencilLine, Trash2 } from "lucide-react";

export default function AdminManageUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState("All");

  // Pagination
  const isMobile = window.innerWidth < 768;
  const itemsPerPage = isMobile ? 5 : 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editValues, setEditValues] = useState({});

  // Delete dialog state
  const [deleteUser, setDeleteUser] = useState(null);

  async function load() {
    try {
      const res = await api.get("/admin/users");

      const donors = (res.data.donors || []).map((u) => ({ ...u, userType: "Donor" }));
      const hospitals = (res.data.hospitals || []).map((u) => ({ ...u, userType: "Hospital" }));
      const recipients = (res.data.recipients || []).map((u) => ({ ...u, userType: "Recipient" }));

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

  async function confirmDelete() {
    if (!deleteUser) return;

    try {
      await api.delete(
        `/admin/delete/${deleteUser.userType.toLowerCase()}/${deleteUser._id}`
      );
      setDeleteUser(null);
      load();
    } catch (err) {
      alert("Failed to delete user");
    }
  }

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

  async function saveEdit() {
    const type = editUser.userType.toLowerCase();

    try {
      await api.put(`/admin/update/${type}/${editUser._id}`, editValues);
      setEditOpen(false);
      load();
    } catch {
      alert("Failed to update user");
    }
  }

  // Search + Filter
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
    setCurrentPage(1);
  }, [search, userType, allUsers]);

  if (loading) return <Loader className="h-12 w-12" />;

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">
            Manage Users
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search by name, email, or hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

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

      {/* DESKTOP TABLE */}
      <div className="hidden md:block">
        <Table>
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
            {currentItems.map((u) => (
              <TableRow key={u._id}>
                <TableCell>{u.userType}</TableCell>
                <TableCell>{u.userType === "Hospital" ? u.hospitalName : u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  {u.userType === "Hospital"
                    ? u.address
                    : `Age: ${u.age || "-"} | Blood: ${u.bloodGroup || "-"}`}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-4">
                    <PencilLine
                      size={20}
                      className="text-blue-600 cursor-pointer hover:scale-110"
                      onClick={() => openEditModal(u)}
                    />

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Trash2
                          size={20}
                          className="text-red-600 cursor-pointer hover:scale-110"
                          onClick={() => setDeleteUser(u)}
                        />
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete user?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The user will be permanently removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={confirmDelete}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {currentItems.map((u) => (
          <Card key={u._id} className="p-4">
            <CardContent className="space-y-2">
              <h3 className="font-semibold">{u.userType}</h3>
              <p><strong>Name:</strong> {u.userType === "Hospital" ? u.hospitalName : u.name}</p>
              <p><strong>Email:</strong> {u.email}</p>

              <div className="flex justify-end gap-4 mt-3">
                <PencilLine
                  size={22}
                  className="text-blue-600 cursor-pointer"
                  onClick={() => openEditModal(u)}
                />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Trash2
                      size={22}
                      className="text-red-600 cursor-pointer"
                      onClick={() => setDeleteUser(u)}
                    />
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete user?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={confirmDelete}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>

          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={editValues.name}
                onChange={(e) =>
                  setEditValues({ ...editValues, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                value={editValues.email}
                onChange={(e) =>
                  setEditValues({ ...editValues, email: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={saveEdit} className="bg-green-600 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
