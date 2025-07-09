
import { useState } from "react";
import { Scissors, Home, Users, FileText, BarChart3, Settings, LogOut, User, UserPlus } from "lucide-react";
import { ActiveTab } from "@/pages/Index";
import { useAuth } from "@/contexts/AuthContext";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface AppSidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

// Navigation items for owners (full access)
const ownerNavItems = [
  { id: "dashboard" as ActiveTab, label: "Dashboard", icon: Home },
  { id: "customers" as ActiveTab, label: "Customers", icon: Users },
  { id: "employees" as ActiveTab, label: "Employees", icon: UserPlus },
  { id: "services" as ActiveTab, label: "Services", icon: Scissors },
  { id: "invoices" as ActiveTab, label: "Invoices", icon: FileText },
  { id: "reports" as ActiveTab, label: "Analytics", icon: BarChart3 },
  { id: "settings" as ActiveTab, label: "Profile", icon: Settings },
];

// Navigation items for employees (limited access - only customers and invoices)
const employeeNavItems = [
  { id: "customers" as ActiveTab, label: "Customers", icon: Users },
  { id: "invoices" as ActiveTab, label: "Invoices", icon: FileText },
];

export const AppSidebar = ({ activeTab, onTabChange }: AppSidebarProps) => {
  const { state, setOpenMobile } = useSidebar();
  const { user, logout } = useAuth();
  const { role } = useAppSelector((state) => state.auth);
  const isCollapsed = state === "collapsed";

  // Use role from Redux state, fallback to user.role, then fallback to localStorage
  const currentRole = role ?? user?.role ?? localStorage.getItem('role') ?? 'employee'; // fallback default

  console.log("Current user role:", currentRole); // Debug log to verify role

  // Determine navigation items based on user role
  const navItems = currentRole === 'owner' ? ownerNavItems : employeeNavItems;

  console.log("Navigation items for current user:", navItems); // Debug log

  const handleTabChange = (tab: ActiveTab) => {
    onTabChange(tab);
    // Close mobile sidebar when a tab is selected
    setOpenMobile(false);
  };

  const handleLogout = () => {
    logout();
    setOpenMobile(false);
  };

  // Get initials from user name or email
  const getInitials = (Name?: string, Email?: string) => {
    if (Name && Name !== 'Salon Owner') {
      return Name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (Email && Email !== 'owner@salon.com') {
      return Email.charAt(0).toUpperCase();
    }
    return 'SO';
  };

  // Get display name with fallback
  const getDisplayName = () => {
    if (user?.Name && user.Name !== 'Salon Owner') {
      return user.Name;
    }
    if (user?.SalonName) {
      return user.SalonName;
    }
    return 'Salon Owner';
  };

  // Get display email with fallback
  const getDisplayEmail = () => {
    if (user?.Email && user.Email !== 'owner@salon.com') {
      return user.Email;
    }
    return 'owner@salon.com';
  };

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Scissors className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-slate-800">SalonPro</h1>
              {currentRole === 'employee' && (
                <p className="text-xs text-slate-600">Employee Access</p>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full justify-start py-3 px-4 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white font-medium"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-3">{item.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-3">
          <Separator className="bg-slate-200" />
          
          {/* User Info */}
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-white text-sm">
                {getInitials(user?.Name, user?.Email)}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 font-medium text-sm truncate">
                  {getDisplayName()}
                </p>
                <p className="text-slate-600 text-xs truncate">
                  {getDisplayEmail()}
                </p>
                {/* Show role for debugging */}
                <p className="text-slate-500 text-xs">
                  Role: {currentRole || 'Unknown'}
                </p>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className={`w-full justify-start text-slate-600 hover:bg-slate-100 hover:text-slate-800 ${
              isCollapsed ? "px-2" : "px-4"
            }`}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
