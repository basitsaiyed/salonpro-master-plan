
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AddCustomerDialog } from "./AddCustomerDialog";
import { EditCustomerDialog } from "./EditCustomerDialog";
import { CustomerCard } from "./CustomerCard";
import { useToast } from "@/hooks/use-toast";
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

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  anniversary: string;
  totalVisits: number;
  lastVisit: string;
  customerType: string;
  totalSpent: number;
}

export const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const { toast } = useToast();
  
  // Mock customer data with enhanced information
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "Aayush",
      phone: "+91 22 2222 2222",
      email: "aayushp@zenithive.com",
      birthday: "Jun 1",
      anniversary: "Jun 1",
      totalVisits: 12,
      lastVisit: "Invalid Date",
      customerType: "Regular",
      totalSpent: 1200
    },
    {
      id: "2",
      name: "Basit Saiyed",
      phone: "+91 78978 97890",
      email: "basits@zenithive.com",
      birthday: "Jul 1",
      anniversary: "Jul 1",
      totalVisits: 8,
      lastVisit: "Invalid Date",
      customerType: "Regular",
      totalSpent: 850
    },
    {
      id: "3",
      name: "Sneha Patel",
      phone: "+91 76543 21098",
      email: "sneha@example.com",
      birthday: "22 Nov",
      anniversary: "05 Jun",
      totalVisits: 15,
      lastVisit: "Today",
      customerType: "Premium",
      totalSpent: 2100
    }
  ]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

  const handleAddCustomer = (newCustomer: any) => {
    const customerWithDefaults = {
      ...newCustomer,
      customerType: "Regular",
      totalSpent: 0
    };
    setCustomers(prev => [...prev, customerWithDefaults]);
    toast({
      title: "Customer Added",
      description: `${newCustomer.name} has been added successfully.`,
    });
  };

  const handleEditCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
    toast({
      title: "Customer Updated",
      description: `${updatedCustomer.name} has been updated successfully.`,
    });
  };

  const handleDeleteCustomer = () => {
    if (customerToDelete) {
      setCustomers(prev => prev.filter(customer => customer.id !== customerToDelete.id));
      toast({
        title: "Customer Deleted",
        description: `${customerToDelete.name} has been deleted successfully.`,
      });
      setCustomerToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Customers ({filteredCustomers.length})
            </h1>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Revenue:</p>
              <p className="text-lg font-semibold text-green-600">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <AddCustomerDialog onAddCustomer={handleAddCustomer} />
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No customers found matching your search.</p>
          </CardContent>
        </Card>
      )}

      <EditCustomerDialog
        customer={editingCustomer}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEditCustomer={handleEditCustomer}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {customerToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
