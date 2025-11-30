
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { HospitalSidebar } from "./HospitalSidebar";
import { Outlet } from "react-router-dom";
import NameBar from "@/components/common/NameBar";
import Footer from "@/components/common/Footer";

export default function HospitalLayout() {
  return (
    <SidebarProvider>
      <HospitalSidebar />

      <SidebarInset className="flex flex-col w-full min-h-screen">
       

        <NameBar />
      
        <div className="flex-1 p-4">
          <Outlet />
        </div>

        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
