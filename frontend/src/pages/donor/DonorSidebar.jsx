import { 
  Home, 
  User, 
  CalendarCheck, 
  ListOrdered, 
  PlusCircle,
  LogOut 
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";  // adjust path if needed

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

const donorMenu = [
  { title: "Dashboard", url: "/donor/dashboard", icon: Home },
  { title: "Profile", url: "/donor/profile", icon: User },
  { title: "Book Appointment", url: "/donor/book-appointment", icon: PlusCircle },
  { title: "Appointment History", url: "/donor/appointments", icon: ListOrdered },

];

export function DonorSidebar() {
  const logout = useAuthStore((state) => state.logout);
  const role = useAuthStore((state) => state.role);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(role);          // calls /donors/logout
    navigate("/");          // redirect to login page
  };

  return (
    <Sidebar className="bg-linear-to-b from-red-600 to-red-800 text-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold text-white">
            Donor Panel
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              
              {/* Normal Menu Items */}
              {donorMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-[15px]
                         transition-all duration-200
                         ${isActive 
                           ? "bg-white/20 font-semibold" 
                           : "hover:bg-white/10"
                         }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Logout Button */}
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
