
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";

interface CreateInvoiceDialogProps {
  onCreateInvoice: (invoice: unknown) => void;
}

const mockCustomers = [
  { id: "1", name: "Priya Sharma" },
  { id: "2", name: "Rahul Kumar" },
  { id: "3", name: "Sneha Patel" }
];

const mockServices = [
  { id: "1", name: "Hair Cut & Styling", price: 500 },
  { id: "2", name: "Beard Trim", price: 200 },
  { id: "3", name: "Facial Treatment", price: 800 },
  { id: "4", name: "Hair Coloring", price: 2000 },
  { id: "5", name: "Manicure", price: 300 }
];

export const CreateInvoiceDialog = ({ onCreateInvoice }: CreateInvoiceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] = useState("unpaid");

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = mockServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedServiceNames = selectedServices.map(id => 
      mockServices.find(s => s.id === id)?.name || ""
    );
    const customerName = mockCustomers.find(c => c.id === selectedCustomer)?.name || "";
    
    const newInvoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${String(Date.now()).slice(-3)}`,
      customerName,
      date: new Date().toISOString().split('T')[0],
      services: selectedServiceNames,
      total: calculateTotal(),
      paymentStatus: paymentStatus as "paid" | "unpaid" | "partial"
    };
    
    onCreateInvoice(newInvoice);
    setSelectedCustomer("");
    setSelectedServices([]);
    setPaymentStatus("unpaid");
    setOpen(false);
  };

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customer">Customer</Label>
            <select
              id="customer"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select customer</option>
              {mockCustomers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Label>Services</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
              {mockServices.map(service => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={service.id}
                    checked={selectedServices.includes(service.id)}
                    onCheckedChange={() => handleServiceToggle(service.id)}
                  />
                  <Label
                    htmlFor={service.id}
                    className="flex-1 cursor-pointer"
                  >
                    {service.name} - ₹{service.price}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="paymentStatus">Payment Status</Label>
            <select
              id="paymentStatus"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
            </select>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between items-center font-bold">
              <span>Total:</span>
              <span>₹{calculateTotal()}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedCustomer || selectedServices.length === 0}>
              Create Invoice
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
