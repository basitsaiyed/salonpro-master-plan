
import { ReactNode } from "react";
import { ActiveTab } from "@/pages/Index";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const DashboardLayout = ({ children, activeTab, onTabChange }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar activeTab={activeTab} onTabChange={onTabChange} />
        
        <div className="flex-1 flex flex-col">
          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
