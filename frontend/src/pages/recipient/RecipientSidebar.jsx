// src/pages/recipient/RecipientSidebar.jsx
import {
  Home,
  User,
  PlusCircle,
  ListOrdered,
  Database,
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
  { title: "Dashboard", url: "/recipient/dashboard", icon: Home },
  { title: "Profile", url: "/recipient/profile", icon: User },
  { title: "Request Blood", url: "/recipient/request-blood", icon: PlusCircle },
  { title: "My Requests", url: "/recipient/requests", icon: ListOrdered },
  { title: "Blood Stock", url: "/recipient/blood-stock", icon: Database },
];

export function RecipientSidebar() {
  const { logout, role } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(role);
    navigate("/");
  };

  return (
    <Sidebar className="bg-linear-to-b from-red-600 to-red-800 text-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold text-white">
            Recipient Panel
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-[15px]
                         ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2 hover:bg-white/10 rounded-lg mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
