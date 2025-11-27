
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import NameBar from "@/components/common/NameBar";
import Footer from "@/components/common/Footer";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset className="flex flex-col w-full min-h-screen">
        <div className="p-2">
          <SidebarTrigger />
        </div>

        <NameBar />

        <div className="flex-1 p-4">
          <Outlet />
        </div>

        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
