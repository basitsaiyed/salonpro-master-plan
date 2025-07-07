
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
    if (user?.Role === 'employee') {
      setActiveTab("customers");
    } else {
      setActiveTab("dashboard");
    }
  }, [user]);

  // Handle tab changes with role-based restrictions
  const handleTabChange = (tab: ActiveTab) => {
    // Restrict employee access to only customers and invoices
    if (user?.Role === 'employee') {
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
        return user?.Role === 'owner' ? <DashboardOverview /> : <CustomerManagement />;
      case "customers":
        return <CustomerManagement />;
      case "employees":
        return user?.Role === 'owner' ? <EmployeeManagement /> : <CustomerManagement />;
      case "services":
        return user?.Role === 'owner' ? <ServiceManagement /> : <CustomerManagement />;
      case "invoices":
        return <InvoiceManagement />;
      case "reports":
        return user?.Role === 'owner' ? <Reports /> : <CustomerManagement />;
      case "settings":
        return user?.Role === 'owner' ? <Settings /> : <CustomerManagement />;
      default:
        return user?.Role === 'owner' ? <DashboardOverview /> : <CustomerManagement />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Index;
