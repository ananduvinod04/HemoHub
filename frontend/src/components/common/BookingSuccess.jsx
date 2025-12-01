import { Dialog, DialogContent } from "@/components/ui/dialog";
import Lottie from "lottie-react";
import successAnim from "@/assets/lottie/booking-success.json"; // your file

export default function BookingSuccess({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-center py-6 gap-3">
        <Lottie animationData={successAnim} loop={false} className="w-52 h-52" />

        <p className="text-green-600 text-2xl font-semibold text-center">
          Appointment Booked Successfully!
        </p>

        <p className="text-gray-600 text-center">
          Your donation appointment has been confirmed.
        </p>
      </DialogContent>
    </Dialog>
  );
}
