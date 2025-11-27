
import {
  Home,
  Users,
  Database,
  ListOrdered,
  CalendarCheck,
  Trash2,
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
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Stock", url: "/admin/stocks", icon: Database },
  { title: "Requests", url: "/admin/requests", icon: ListOrdered },
  { title: "Appointments", url: "/admin/appointments", icon: CalendarCheck },
  { title: "Delete Logs", url: "/admin/delete-logs", icon: Trash2 },
];

export function AdminSidebar() {
  const logout = useAuthStore((s) => s.logout);
  const role = useAuthStore((s) => s.role);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(role);
    navigate("/");
  };

  return (
    <Sidebar className="bg-linear-to-b from-slate-800 to-slate-900 text-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold text-white">
            Admin Panel
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
                         ${isActive ? "bg-white/10 font-semibold" : "hover:bg-white/5"}`
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
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[15px] hover:bg-white/5 mt-4"
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
