
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Scissors, FileText, BarChart3, Settings as SettingsIcon, Home } from "lucide-react";
import { ActiveTab } from "@/pages/Index";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const DashboardLayout = ({ children, activeTab, onTabChange }: DashboardLayoutProps) => {
  const navItems = [
    { id: "dashboard" as ActiveTab, label: "Dashboard", icon: Home },
    { id: "customers" as ActiveTab, label: "Customers", icon: Users },
    { id: "services" as ActiveTab, label: "Services", icon: Scissors },
    { id: "invoices" as ActiveTab, label: "Invoices", icon: FileText },
    { id: "reports" as ActiveTab, label: "Reports", icon: BarChart3 },
    { id: "settings" as ActiveTab, label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Scissors className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">SalonPro</h1>
            </div>
            <div className="text-sm text-gray-600">
              Welcome back, Salon Owner!
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <Card className="p-4">
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => onTabChange(item.id)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
