import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function About({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-red-600">About Hemohub</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Hemohub is a blood donation management platform designed to connect
          donors, recipients, and hospitals efficiently. Our goal is to ensure
          timely availability of blood and save lives through technology.
        </p>
      </DialogContent>
    </Dialog>
  );
}
