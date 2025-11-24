import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DonorSidebar } from "./DonorSidebar";
import Footer from "@/components/common/Footer";
import { Outlet } from "react-router-dom";
import NameBar from "@/components/common/NameBar";




export default function DonorLayout() {
  return (
    <SidebarProvider>
      <DonorSidebar />

      <SidebarInset className="flex flex-col w-full min-h-screen">

        {/* Header / toggle button */}
        

        {/* Page content */}
        <div className="flex-1 px-4 py-2">
          <NameBar />
           <div className="p-2">
          <SidebarTrigger />
        </div>

          <Outlet />
        </div>

        {/* Footer */}
        <Footer />
      </SidebarInset>

    </SidebarProvider>
  );
}
