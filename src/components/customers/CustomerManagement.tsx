import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, Mail, Phone, Gift, Heart, Filters } from "lucide-react";
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
          <p className="text-gray-600">Manage your salon customers and their information</p>
        </div>
        <AddCustomerDialog onAddCustomer={handleAddCustomer} />
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search customers by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>
          <Button variant="outline" className="h-12 px-6">
            <Filters className="h-5 w-5 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Customers ({filteredCustomers.length})
            </h2>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                Total Revenue: ${totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="divide-y">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold text-gray-900">{customer.name}</h3>
                  <span className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                    {customer.customerType}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(customer)}
                    className="h-10 w-10 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openDeleteDialog(customer)}
                    className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-5 w-5" />
                  <span className="text-base">{customer.email}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="h-5 w-5" />
                  <span className="text-base">{customer.phone}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Gift className="h-5 w-5 text-pink-500" />
                  <span className="text-base">Birthday: {customer.birthday}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-base">Anniversary: {customer.anniversary}</span>
                </div>
              </div>

              <div className="flex items-center gap-8 text-base">
                <div>
                  <span className="text-gray-600">Visits: </span>
                  <span className="font-semibold">{customer.totalVisits}</span>
                </div>
                <div>
                  <span className="text-gray-600">Spent: </span>
                  <span className="font-semibold text-green-600">${customer.totalSpent}</span>
                </div>
                <div>
                  <span className="text-gray-600">Last visit: </span>
                  <span className="font-medium">{customer.lastVisit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg">No customers found matching your search.</p>
          </div>
        )}
      </div>

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
