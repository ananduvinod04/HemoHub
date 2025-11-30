import { SidebarTrigger } from "@/components/ui/sidebar";   // ✅ add this
import { ModeToggle } from "../mode-toggle";

export default function NameBar() {
  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-6 py-3 
                      flex items-center justify-between">

        {/* LEFT - Sidebar Trigger + Logo */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-red-600 dark:text-red-400" />  {/* 🔥 trigger at top */}
          
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Hemohub
          </h1>
        </div>

        {/* RIGHT - Theme Toggle */}
        <ModeToggle />
      </div>
    </header>
  );
}