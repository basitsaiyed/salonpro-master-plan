
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Invoice, UpdateInvoiceInput, Customer, Service, apiClient } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditInvoiceDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditInvoice: (invoiceData: UpdateInvoiceInput) => void;
}

export const EditInvoiceDialog = ({ invoice, open, onOpenChange, onEditInvoice }: EditInvoiceDialogProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerId: invoice?.CustomerID || "",
    discount: invoice?.Discount || 0,
    tax: invoice?.Tax || 0,
    paymentStatus: invoice?.PaymentStatus || "unpaid",
    paidAmount: invoice?.PaidAmount || 0,
    paymentMethod: invoice?.PaymentMethod || "",
    notes: invoice?.Notes || ""
  });
  const { toast } = useToast();

  // Update form data when invoice changes
  useEffect(() => {
    if (invoice) {
      setFormData({
        customerId: invoice.CustomerID,
        discount: invoice.Discount,
        tax: invoice.Tax,
        paymentStatus: invoice.PaymentStatus,
        paidAmount: invoice.PaidAmount,
        paymentMethod: invoice.PaymentMethod,
        notes: invoice.Notes
      });
    }
  }, [invoice]);

  // Load customers when dialog opens
  useEffect(() => {
    if (open) {
      loadCustomers();
    }
  }, [open]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const customersData = await apiClient.getCustomers();
      setCustomers(customersData || []);
    } catch (error) {
      console.error('Failed to load customers:', error);
      toast({
        title: "Error",
        description: "Failed to load customers.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (invoice) {
      const updateData: UpdateInvoiceInput = {
        customerId: formData.customerId !== invoice.CustomerID ? formData.customerId : undefined,
        discount: formData.discount !== invoice.Discount ? formData.discount : undefined,
        tax: formData.tax !== invoice.Tax ? formData.tax : undefined,
        paymentStatus: formData.paymentStatus !== invoice.PaymentStatus ? formData.paymentStatus as "paid" | "unpaid" | "partial" : undefined,
        paidAmount: formData.paidAmount !== invoice.PaidAmount ? formData.paidAmount : undefined,
        paymentMethod: formData.paymentMethod !== invoice.PaymentMethod ? formData.paymentMethod : undefined,
        notes: formData.notes !== invoice.Notes ? formData.notes : undefined
      };
      
      onEditInvoice(updateData);
      onOpenChange(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-lg">Loading...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const selectedCustomer = customers.find(c => c.ID === formData.customerId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Invoice - {invoice?.InvoiceNumber}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customer">Customer</Label>
            <Select value={formData.customerId} onValueChange={(value) => handleChange('customerId', value)}>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount">Discount ($)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                step="0.01"
                value={formData.discount}
                onChange={(e) => handleChange('discount', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="tax">Tax (%)</Label>
              <Input
                id="tax"
                type="number"
                min="0"
                step="0.01"
                value={formData.tax}
                onChange={(e) => handleChange('tax', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select value={formData.paymentStatus} onValueChange={(value) => handleChange('paymentStatus', value)}>
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
                value={formData.paidAmount}
                onChange={(e) => handleChange('paidAmount', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Input
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
              placeholder="Cash, Card, UPI, etc."
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes..."
            />
          </div>

          {invoice && (
            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${invoice.Subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span>-${formData.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>%{formData.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${(invoice.Subtotal - formData.discount + formData.tax).toFixed(2)}</span>
              </div>
            </div>
          )}

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
