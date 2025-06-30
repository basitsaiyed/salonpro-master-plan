
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, FileText } from "lucide-react";
import { CreateInvoiceDialog } from "./CreateInvoiceDialog";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  date: string;
  services: string[];
  total: number;
  paymentStatus: "paid" | "unpaid" | "partial";
}

export const InvoiceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock invoice data with state management
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      invoiceNumber: "INV-001",
      customerName: "Priya Sharma",
      date: "2024-06-28",
      services: ["Hair Cut & Styling", "Facial Treatment"],
      total: 1300,
      paymentStatus: "paid"
    },
    {
      id: "2",
      invoiceNumber: "INV-002",
      customerName: "Rahul Kumar",
      date: "2024-06-27",
      services: ["Beard Trim"],
      total: 200,
      paymentStatus: "unpaid"
    },
    {
      id: "3",
      invoiceNumber: "INV-003",
      customerName: "Sneha Patel",
      date: "2024-06-26",
      services: ["Hair Coloring", "Hair Cut & Styling"],
      total: 2500,
      paymentStatus: "partial"
    }
  ]);

  const filteredInvoices = invoices.filter(invoice =>
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateInvoice = (newInvoice: Invoice) => {
    setInvoices(prev => [...prev, newInvoice]);
  };

  const handleViewInvoice = (invoiceId: string) => {
    console.log("View invoice:", invoiceId);
    // TODO: Implement view invoice functionality
  };

  const handleEditInvoice = (invoiceId: string) => {
    console.log("Edit invoice:", invoiceId);
    // TODO: Implement edit invoice functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Management</h2>
          <p className="text-gray-600">Track and manage your salon invoices</p>
        </div>
        <CreateInvoiceDialog onCreateInvoice={handleCreateInvoice} />
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search invoices by customer name or invoice number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Invoice #</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Services</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {invoice.customerName}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        {invoice.services.join(", ")}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      ₹{invoice.total}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(invoice.paymentStatus)}`}>
                        {invoice.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewInvoice(invoice.id)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditInvoice(invoice.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
