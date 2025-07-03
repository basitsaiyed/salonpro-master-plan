
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Customer, UpdateCustomerInput } from "@/lib/api";

interface EditCustomerDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditCustomer: (customer: UpdateCustomerInput) => void;
}

export const EditCustomerDialog = ({ customer, open, onOpenChange, onEditCustomer }: EditCustomerDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    birthday: "",
    anniversary: "",
    notes: "",
    isActive: true
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.Name || "",
        phone: customer.Phone || "",
        email: customer.Email || "",
        birthday: customer.Birthday ? customer.Birthday.split('T')[0] : "",
        anniversary: customer.Anniversary ? customer.Anniversary.split('T')[0] : "",
        notes: customer.Notes || "",
        isActive: customer.IsActive
      });
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleActiveChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isActive: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customer) {
      const toISO = (date: string) => date ? new Date(date).toISOString() : undefined;

      const updateData: UpdateCustomerInput = {
        name: formData.name || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        birthday: toISO(formData.birthday),
        anniversary: toISO(formData.anniversary),
        notes: formData.notes || undefined,
        isActive: formData.isActive
      };

      onEditCustomer(updateData);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Customer name"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="customer@example.com"
            />
          </div>
          <div>
            <Label htmlFor="birthday">Birthday</Label>
            <Input
              id="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="anniversary">Anniversary</Label>
            <Input
              id="anniversary"
              type="date"
              value={formData.anniversary}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes about the customer..."
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={handleActiveChange}
            />
            <Label htmlFor="isActive">Active Customer</Label>
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
