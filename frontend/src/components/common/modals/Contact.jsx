import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Contact({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-red-600">Contact Us</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <p>Email: support@hemohub.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Location: Kerala, India</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
