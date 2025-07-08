
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { CustomerManagement } from "@/components/customers/CustomerManagement"; 
import { ServiceManagement } from "@/components/services/ServiceManagement";
import { InvoiceManagement } from "@/components/invoices/InvoiceManagement";
import { Reports } from "@/components/reports/Reports";
import { Settings } from "@/components/settings/Settings";
import { EmployeeManagement } from "@/components/employees/EmployeeManagement";
import { useAuth } from "@/contexts/AuthContext";

export type ActiveTab = "dashboard" | "customers" | "services" | "invoices" | "reports" | "settings" | "employees";

const Index = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

  // Set default tab based on user role
  useEffect(() => {
    if (user?.role === 'employee') {
      setActiveTab("customers");
    } else {
      setActiveTab("dashboard");
    }
  }, [user]);

  // Handle tab changes with role-based restrictions
  const handleTabChange = (tab: ActiveTab) => {
    // Restrict employee access to only customers and invoices
    if (user?.role === 'employee') {
      if (tab === 'customers' || tab === 'invoices') {
        setActiveTab(tab);
      }
      return;
    }
    
    // Owners have full access
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return user?.role === 'owner' ? <DashboardOverview /> : <CustomerManagement />;
      case "customers":
        return <CustomerManagement />;
      case "employees":
        return user?.role === 'owner' ? <EmployeeManagement /> : <CustomerManagement />;
      case "services":
        return user?.role === 'owner' ? <ServiceManagement /> : <CustomerManagement />;
      case "invoices":
        return <InvoiceManagement />;
      case "reports":
        return user?.role === 'owner' ? <Reports /> : <CustomerManagement />;
      case "settings":
        return user?.role === 'owner' ? <Settings /> : <CustomerManagement />;
      default:
        return user?.role === 'owner' ? <DashboardOverview /> : <CustomerManagement />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Index;
