
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
import { Button } from "@/components/ui/button";

export default function AdminManageUsers() {
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api.get("/admin/users");
      setDonors(res.data.donors || []);
      setHospitals(res.data.hospitals || []);
      setRecipients(res.data.recipients || []);
    } catch (err) {
      console.error("Load users error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function remove(type, id) {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/delete/${type}/${id}`);
      load();
    } catch (err) {
      console.error("Delete user error:", err);
      alert("Failed to delete");
    }
  }

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Donors</h3>
      <Table>
        <TableCaption>All donors</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donors.map((d) => (
            <TableRow key={d._id}>
              <TableCell>{d.name}</TableCell>
              <TableCell>{d.email}</TableCell>
              <TableCell>{d.bloodGroup}</TableCell>
              <TableCell>{d.age}</TableCell>
              <TableCell>
                <Button size="sm" onClick={() => remove("donor", d._id)} className="bg-red-600 text-white">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h3 className="text-lg font-semibold mt-6">Hospitals</h3>
      <Table>
        <TableCaption>All hospitals</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Hospital</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>License</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hospitals.map((h) => (
            <TableRow key={h._id}>
              <TableCell>{h.hospitalName}</TableCell>
              <TableCell>{h.email}</TableCell>
              <TableCell>{h.licenseNumber}</TableCell>
              <TableCell>{h.address}</TableCell>
              <TableCell>
                <Button size="sm" onClick={() => remove("hospital", h._id)} className="bg-red-600 text-white">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h3 className="text-lg font-semibold mt-6">Recipients</h3>
      <Table>
        <TableCaption>All recipients</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipients.map((r) => (
            <TableRow key={r._id}>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.email}</TableCell>
              <TableCell>{r.bloodGroup}</TableCell>
              <TableCell>{r.age}</TableCell>
              <TableCell>
                <Button size="sm" onClick={() => remove("recipient", r._id)} className="bg-red-600 text-white">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
