// src/pages/recipient/RecipientBloodStock.jsx
import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow, TableCaption
} from "@/components/ui/table";

export default function RecipientBloodStock() {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.get("/recipient/all-blood-stock");
      setStock(res.data);
    }
    load();
  }, []);

  return (
    <Table>
      <TableCaption>Available blood stock across hospitals</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Hospital</TableHead>
          <TableHead>Blood Group</TableHead>
          <TableHead>Units</TableHead>
          <TableHead>Expiry</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {stock.map((s) => (
          <TableRow key={s._id}>
            <TableCell>{s.hospital?.hospitalName}</TableCell>
            <TableCell>{s.bloodGroup}</TableCell>
            <TableCell>{s.units}</TableCell>
            <TableCell>
              {new Date(s.expiryDate).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
