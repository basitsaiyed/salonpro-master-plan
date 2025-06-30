
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { CustomerManagement } from "@/components/customers/CustomerManagement";
import { ServiceManagement } from "@/components/services/ServiceManagement";
import { InvoiceManagement } from "@/components/invoices/InvoiceManagement";
import { Reports } from "@/components/reports/Reports";
import { Settings } from "@/components/settings/Settings";

export type ActiveTab = "dashboard" | "customers" | "services" | "invoices" | "reports" | "settings";

const Index = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "customers":
        return <CustomerManagement />;
      case "services":
        return <ServiceManagement />;
      case "invoices":
        return <InvoiceManagement />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Index;
