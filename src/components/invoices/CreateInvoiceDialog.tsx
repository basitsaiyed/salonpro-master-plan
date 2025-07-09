import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient, Customer, Service, CreateInvoiceInput, InvoiceItemInput, Employee } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateInvoiceDialogProps {
  onCreateInvoice: (invoice: CreateInvoiceInput) => void;
}

interface ServiceWithEmployee {
  [serviceId: string]: {
    quantity: number;
    employeeId?: string;
  };
}

export const CreateInvoiceDialog = ({ onCreateInvoice }: CreateInvoiceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedServices, setSelectedServices] = useState<ServiceWithEmployee>({});
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "unpaid" | "partial">("unpaid");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load customers, services, and employees when dialog opens
  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load customers and services first
      const [customersData, servicesData] = await Promise.all([
        apiClient.getCustomers(),
        apiClient.getServices()
      ]);

      console.log('Customers loaded:', customersData);
      console.log('Services loaded:', servicesData);
      setCustomers(customersData || []);
      setServices(servicesData || []);

      // Load employees separately if user is owner
      if (user?.role === 'owner') {
        try {
          const employeesData = await apiClient.getEmployees();
          console.log('Employees loaded:', employeesData);
          setEmployees(employeesData || []);
        } catch (error) {
          console.error('Failed to load employees:', error);
          setEmployees([]);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (serviceId: string, quantity: number = 1) => {
    setSelectedServices(prev => {
      const newSelection = { ...prev };
      if (quantity > 0) {
        newSelection[serviceId] = {
          quantity,
          employeeId: prev[serviceId]?.employeeId || ""
        };
      } else {
        delete newSelection[serviceId];
      }
      return newSelection;
    });
  };

  const handleEmployeeChange = (serviceId: string, employeeId: string) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        employeeId
      }
    }));
  };

  const calculateSubtotal = () => {
    return Object.entries(selectedServices).reduce((total, [serviceId, { quantity }]) => {
      const service = services.find(s => s.ID === serviceId);
      return total + (service?.Price || 0) * quantity;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = subtotal * (tax / 100);  // ✅ apply tax as a percentage
    return subtotal - discount + taxAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomer || Object.keys(selectedServices).length === 0) {
      toast({
        title: "Error",
        description: "Please select a customer and at least one service.",
        variant: "destructive",
      });
      return;
    }

    const items: InvoiceItemInput[] = Object.entries(selectedServices).map(([serviceId, { quantity, employeeId }]) => ({
      serviceId,
      quantity,
      ...(user?.role === 'owner' && employeeId && { employeeId })
    }));

    const invoiceData: CreateInvoiceInput = {
      customerId: selectedCustomer,
      items,
      discount,
      tax,
      paymentStatus,
      paidAmount,
      paymentMethod,
      notes
    };

    try {
      await onCreateInvoice(invoiceData);
      // Reset form
      setSelectedCustomer("");
      setSelectedServices({});
      setPaymentStatus("unpaid");
      setDiscount(0);
      setTax(0);
      setPaidAmount(0);
      setPaymentMethod("");
      setNotes("");
      setOpen(false);
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Invoice
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-lg">Loading data...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customer">Customer</Label>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.ID} value={customer.ID}>
                    {customer.Name} - {customer.Phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Services</Label>
            <div className="space-y-3 max-h-64 overflow-y-auto border rounded-md p-3">
              {services.filter(service => service.IsActive).map(service => (
                <div key={service.ID} className="space-y-2 p-2 border rounded-md bg-gray-50">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2 flex-1">
                      <Checkbox
                        id={service.ID}
                        checked={service.ID in selectedServices}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleServiceToggle(service.ID, 1);
                          } else {
                            handleServiceToggle(service.ID, 0);
                          }
                        }}
                      />
                      <Label
                        htmlFor={service.ID}
                        className="flex-1 cursor-pointer text-sm font-medium"
                      >
                        {service.Name} - ${service.Price}
                      </Label>
                    </div>
                    {service.ID in selectedServices && (
                      <Input
                        type="number"
                        min="1"
                        value={selectedServices[service.ID].quantity}
                        onChange={(e) => handleServiceToggle(service.ID, parseInt(e.target.value) || 1)}
                        className="w-16 h-8"
                      />
                    )}
                  </div>

                  {/* Employee selection - only show for owners */}
                  {service.ID in selectedServices && user?.role === 'owner' && employees.length > 0 && (
                    <div className="ml-6">
                      <Label className="text-xs text-gray-600">Assigned Employee</Label>
                      <Select
                        value={selectedServices[service.ID].employeeId || ""}
                        onValueChange={(employeeId) => handleEmployeeChange(service.ID, employeeId)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(employee => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount">Discount ($)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="tax">Tax (%)</Label>
              <Input
                id="tax"
                type="number"
                min="0"
                step="0.01"
                value={tax}
                onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select value={paymentStatus} onValueChange={(value: "paid" | "unpaid" | "partial") => setPaymentStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paidAmount">Paid Amount ($)</Label>
              <Input
                id="paidAmount"
                type="number"
                min="0"
                step="0.01"
                value={paidAmount}
                onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Input
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              placeholder="Cash, Card, UPI, etc."
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount:</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax:</span>
              <span>%{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedCustomer || Object.keys(selectedServices).length === 0}>
              Create Invoice
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
