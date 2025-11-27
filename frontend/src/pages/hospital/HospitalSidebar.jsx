
import {
  Home,
  User,
  PlusCircle,
  Database,
  CalendarCheck,
  ListOrdered,
  LogOut
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menu = [
  { title: "Dashboard", url: "/hospital/dashboard", icon: Home },
  { title: "Profile", url: "/hospital/profile", icon: User },
  { title: "Add Stock", url: "/hospital/add-stock", icon: PlusCircle },
  { title: "Manage Stock", url: "/hospital/manage-stock", icon: Database },
  { title: "Appointments", url: "/hospital/appointments", icon: CalendarCheck },
  { title: "Requests", url: "/hospital/requests", icon: ListOrdered },
];

export function HospitalSidebar() {
  const logout = useAuthStore((s) => s.logout);
  const role = useAuthStore((s) => s.role);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(role);
    navigate("/");
  };

  return (
    <Sidebar className="bg-linear-to-b from-red-700 to-red-900 text-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold text-white">
            Hospital Panel
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((m) => (
                <SidebarMenuItem key={m.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={m.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-[15px]
                         transition-all duration-200
                         ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`
                      }
                    >
                      <m.icon className="w-5 h-5" />
                      <span>{m.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[15px] hover:bg-white/10 mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
