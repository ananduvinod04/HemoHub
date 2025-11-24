import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DonationHistoryTable({ history = [] }) {
  return (
    <div className="mt-10">
      <Table>
        <TableCaption>Your complete donation appointment history.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Hospital</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {history.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                No history found.
              </TableCell>
            </TableRow>
          ) : (
            history.map((appt, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{appt.hospitalName}</TableCell>
                <TableCell>{appt.type}</TableCell>
                <TableCell>
                  {new Date(appt.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="capitalize">{appt.status}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
