import { Dialog, DialogContent } from "@/components/ui/dialog";
import Lottie from "lottie-react";
import successAnim from "@/assets/lottie/booking-success.json"; // same animation

export default function BloodStockAddedSuccess({ open, onOpenChange }) {
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
          Blood Stock Added!
        </p>

        {/* Sub text */}
        <p className="text-gray-600 text-center">
          The blood stock has been successfully updated.
        </p>

      </DialogContent>
    </Dialog>
  );
}
