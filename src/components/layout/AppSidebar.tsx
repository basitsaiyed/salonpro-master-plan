import { useState } from "react";
import { Scissors, Home, Users, FileText, BarChart3, Settings, LogOut, User } from "lucide-react";
import { ActiveTab } from "@/pages/Index";
import { useAuth } from "@/contexts/AuthContext";
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

const navItems = [
  { id: "dashboard" as ActiveTab, label: "Dashboard", icon: Home },
  { id: "customers" as ActiveTab, label: "Customers", icon: Users },
  { id: "services" as ActiveTab, label: "Services", icon: Scissors },
  { id: "invoices" as ActiveTab, label: "Invoices", icon: FileText },
  { id: "reports" as ActiveTab, label: "Analytics", icon: BarChart3 },
  { id: "settings" as ActiveTab, label: "Profile", icon: Settings },
];

export const AppSidebar = ({ activeTab, onTabChange }: AppSidebarProps) => {
  const { state, setOpenMobile } = useSidebar();
  const { user, logout } = useAuth();
  const isCollapsed = state === "collapsed";

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
  const getInitials = (name?: string, email?: string) => {
    if (name && name !== 'Salon Owner') {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email && email !== 'owner@salon.com') {
      return email.charAt(0).toUpperCase();
    }
    return 'SO';
  };

  // Get display name with fallback
  const getDisplayName = () => {
    if (user?.name && user.name !== 'Salon Owner') {
      return user.name;
    }
    if (user?.salonName) {
      return user.salonName;
    }
    return 'Salon Owner';
  };

  // Get display email with fallback
  const getDisplayEmail = () => {
    if (user?.email && user.email !== 'owner@salon.com') {
      return user.email;
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
            <h1 className="text-xl font-bold text-slate-800">SalonPro</h1>
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
                {getInitials(user?.name, user?.email)}
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
