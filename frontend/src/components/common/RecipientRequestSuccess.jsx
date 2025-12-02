import { Dialog, DialogContent } from "@/components/ui/dialog";
import Lottie from "lottie-react";
import successAnim from "@/assets/lottie/booking-success.json"; // your success animation

export default function RecipientRequestSuccess({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-center py-6 gap-3">

        {/* Success Animation */}
        <Lottie
          animationData={successAnim}
          loop={false}
          className="w-52 h-52"
        />

        {/* Heading */}
        <p className="text-green-600 text-2xl font-semibold text-center">
          Request Submitted Successfully!
        </p>

        {/* Sub text */}
        <p className="text-gray-600 text-center px-4">
          Your blood request has been sent to the hospital and is now awaiting review.
        </p>

      </DialogContent>
    </Dialog>
  );
}
