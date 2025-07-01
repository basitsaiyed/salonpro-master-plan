
import { useState } from "react";
import { Scissors, Home, Users, FileText, BarChart3, Settings, LogOut, User } from "lucide-react";
import { ActiveTab } from "@/pages/Index";
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
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
    // You can add actual logout functionality here
  };

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Scissors className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-white">SalonPro</h1>
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
                      onClick={() => onTabChange(item.id)}
                      className={`w-full justify-start py-3 px-4 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-white/20 text-white font-medium"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
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
          <Separator className="bg-white/20" />
          
          {/* User Info */}
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-white/20 text-white text-sm">
                SO
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">Salon Owner</p>
                <p className="text-white/70 text-xs truncate">owner@salon.com</p>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className={`w-full justify-start text-white/80 hover:bg-white/10 hover:text-white ${
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
