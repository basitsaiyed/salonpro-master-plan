
import { ReactNode } from "react";
import { ActiveTab } from "@/pages/Index";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
          {/* Header */}
          <header className="bg-white border-b border-slate-200 shadow-sm h-16">
            <div className="flex items-center h-full px-6">
              <SidebarTrigger className="mr-4" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-800 capitalize">
                  {activeTab === "reports" ? "Analytics" : activeTab}
                </h2>
                <p className="text-sm text-slate-600">
                  Welcome back! Here's what's happening at your salon today.
                </p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
