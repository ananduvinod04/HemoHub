import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { HospitalSidebar } from "./HospitalSidebar";
import { Outlet } from "react-router-dom";
import NameBar from "@/components/common/NameBar";
import Footer from "@/components/common/Footer";

export default function HospitalLayout() {
  return (
    <SidebarProvider>
      <HospitalSidebar />

      <SidebarInset className="flex flex-col w-full min-h-screen">

        {/* ---- STICKY HEADER ---- */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 shadow-sm">
          <NameBar />
        </div>

        {/* ---- MAIN CONTENT ---- */}
        <div className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </div>

        {/* ---- FOOTER ---- */}
        <Footer />

      </SidebarInset>
    </SidebarProvider>
  );
}
