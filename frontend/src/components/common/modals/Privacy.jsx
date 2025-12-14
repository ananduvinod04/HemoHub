import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Privacy({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-red-600">Privacy Policy</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Hemohub respects your privacy. All personal data including health
          information is securely stored and never shared without consent.
          Cookies are used only for authentication purposes.
        </p>
      </DialogContent>
    </Dialog>
  );
}
