
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  date: string;
  services: string[];
  total: number;
  paymentStatus: "paid" | "unpaid" | "partial";
}

interface EditInvoiceDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditInvoice: (invoice: Invoice) => void;
}

export const EditInvoiceDialog = ({ invoice, open, onOpenChange, onEditInvoice }: EditInvoiceDialogProps) => {
  const [formData, setFormData] = useState({
    customerName: invoice?.customerName || "",
    services: invoice?.services.join(", ") || "",
    total: invoice?.total.toString() || "",
    paymentStatus: invoice?.paymentStatus || "unpaid"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (invoice) {
      const updatedInvoice = {
        ...invoice,
        customerName: formData.customerName,
        services: formData.services.split(", ").filter(s => s.trim()),
        total: Number(formData.total),
        paymentStatus: formData.paymentStatus as "paid" | "unpaid" | "partial"
      };
      onEditInvoice(updatedInvoice);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="services">Services (comma separated)</Label>
            <Input
              id="services"
              value={formData.services}
              onChange={handleChange}
              placeholder="Hair Cut, Facial Treatment"
            />
          </div>
          <div>
            <Label htmlFor="total">Total Amount (₹)</Label>
            <Input
              id="total"
              type="number"
              value={formData.total}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="paymentStatus">Payment Status</Label>
            <select
              id="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
