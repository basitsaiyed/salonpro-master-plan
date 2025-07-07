import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Eye, Trash2 } from "lucide-react";
import { CreateInvoiceDialog } from "./CreateInvoiceDialog";
import { EditInvoiceDialog } from "./EditInvoiceDialog";
import { useToast } from "@/hooks/use-toast";
import { apiClient, Invoice, CreateInvoiceInput, UpdateInvoiceInput, Customer } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

export const InvoiceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Load invoices and customers from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [invoicesData, customersData] = await Promise.all([
        apiClient.getInvoices(),
        apiClient.getCustomers()
      ]);
      console.log('Invoices loaded:', invoicesData);
      console.log('Customers loaded:', customersData);
      setInvoices(invoicesData || []);
      setCustomers(customersData || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: "Error",
        description: "Failed to load invoices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.ID === customerId);
    return customer?.Name || 'Unknown Customer';
  };

  const filteredInvoices = invoices.filter(invoice => {
    const customerName = getCustomerName(invoice.CustomerID);
    return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           invoice.InvoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

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

  const handleCreateInvoice = async (invoiceData: CreateInvoiceInput) => {
    try {
      await apiClient.createInvoice(invoiceData);
      await loadData();
      toast({
        title: "Invoice Created",
        description: "New invoice has been created successfully.",
      });
    } catch (error) {
      console.error('Failed to create invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditInvoice = async (updateData: UpdateInvoiceInput) => {
    if (!editingInvoice) return;
    
    try {
      await apiClient.updateInvoice(editingInvoice.ID, updateData);
      await loadData();
      toast({
        title: "Invoice Updated",
        description: `Invoice ${editingInvoice.InvoiceNumber} has been updated successfully.`,
      });
    } catch (error) {
      console.error('Failed to update invoice:', error);
      toast({
        title: "Error",
        description: "Failed to update invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    
    try {
      await apiClient.deleteInvoice(invoiceToDelete.ID);
      await loadData();
      toast({
        title: "Invoice Deleted",
        description: `Invoice ${invoiceToDelete.InvoiceNumber} has been deleted successfully.`,
      });
      setInvoiceToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      toast({
        title: "Error",
        description: "Failed to delete invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    const customerName = getCustomerName(invoice.CustomerID);
    const servicesList = invoice.Items.map(item => `${item.ServiceName} (${item.Quantity}x)`).join(', ');
    
    toast({
      title: "Invoice Details",
      description: `${invoice.InvoiceNumber} - ${customerName} | Services: ${servicesList} | Total: ₹${invoice.Total.toFixed(2)}`,
    });
  };

  const openEditDialog = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const handleUpdatePaymentStatus = async (invoice: Invoice, newStatus: "paid" | "unpaid" | "partial") => {
    try {
      await apiClient.updateInvoice(invoice.ID, { paymentStatus: newStatus });
      await loadData();
      
      toast({
        title: "Payment Status Updated",
        description: `Invoice payment status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Failed to update payment status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Mobile card view for invoices
  const MobileInvoiceCard = ({ invoice }: { invoice: Invoice }) => (
    <Card key={invoice.ID} className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{invoice.InvoiceNumber}</h3>
            <p className="text-sm text-gray-600">{getCustomerName(invoice.CustomerID)}</p>
          </div>
          <span className="text-lg font-bold">₹{invoice.Total.toFixed(2)}</span>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date:</span>
            <span>{new Date(invoice.InvoiceDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Services:</span>
            <span className="text-right text-xs">
              {invoice.Items.map(item => `${item.ServiceName} (${item.Quantity}x)`).join(", ")}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button 
            className={`px-3 py-1 rounded text-xs font-medium capitalize cursor-pointer hover:opacity-80 ${getStatusColor(invoice.PaymentStatus)}`}
            onClick={() => {
              const statuses: ("paid" | "unpaid" | "partial")[] = ["paid", "unpaid", "partial"];
              const currentIndex = statuses.indexOf(invoice.PaymentStatus);
              const nextStatus = statuses[(currentIndex + 1) % statuses.length];
              handleUpdatePaymentStatus(invoice, nextStatus);
            }}
          >
            {invoice.PaymentStatus}
          </button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewInvoice(invoice)}
              title="View Invoice"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => openEditDialog(invoice)}
              title="Edit Invoice"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => openDeleteDialog(invoice)}
              title="Delete Invoice"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Invoice Management</h2>
          <p className="text-sm md:text-base text-gray-600">Track and manage your salon invoices</p>
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
        <CardContent className="p-0 md:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg">Loading invoices...</div>
            </div>
          ) : (
            <>
              {isMobile ? (
                <div className="p-4">
                  {filteredInvoices.map((invoice) => (
                    <MobileInvoiceCard key={invoice.ID} invoice={invoice} />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="hidden lg:table-cell">Services</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.ID}>
                          <TableCell className="font-medium">
                            {invoice.InvoiceNumber}
                          </TableCell>
                          <TableCell>
                            {getCustomerName(invoice.CustomerID)}
                          </TableCell>
                          <TableCell>
                            {new Date(invoice.InvoiceDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {invoice.Items.map(item => `${item.ServiceName} (${item.Quantity}x)`).join(", ")}
                            </div>
                          </TableCell>
                          <TableCell className="font-bold">
                            ₹{invoice.Total.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <button 
                              className={`px-2 py-1 rounded text-xs font-medium capitalize cursor-pointer hover:opacity-80 ${getStatusColor(invoice.PaymentStatus)}`}
                              onClick={() => {
                                const statuses: ("paid" | "unpaid" | "partial")[] = ["paid", "unpaid", "partial"];
                                const currentIndex = statuses.indexOf(invoice.PaymentStatus);
                                const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                                handleUpdatePaymentStatus(invoice, nextStatus);
                              }}
                            >
                              {invoice.PaymentStatus}
                            </button>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewInvoice(invoice)}
                                title="View Invoice"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openEditDialog(invoice)}
                                title="Edit Invoice"
                                className="hidden sm:inline-flex"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openDeleteDialog(invoice)}
                                title="Delete Invoice"
                                className="text-red-600 hover:text-red-700 hidden sm:inline-flex"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}

          {!loading && filteredInvoices.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No invoices found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <EditInvoiceDialog
        invoice={editingInvoice}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEditInvoice={handleEditInvoice}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete invoice {invoiceToDelete?.InvoiceNumber}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInvoice}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
