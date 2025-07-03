
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, Mail, Phone, Gift, Heart, Filter } from "lucide-react";
import { AddCustomerDialog } from "./AddCustomerDialog";
import { EditCustomerDialog } from "./EditCustomerDialog";
import { CustomerCard } from "./CustomerCard";
import { useToast } from "@/hooks/use-toast";
import { apiClient, Customer, CreateCustomerInput, UpdateCustomerInput } from "@/lib/api";
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

export const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load customers from API
  useEffect(() => {
    loadCustomers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getCustomers();
      console.log('Customers loaded:', response);
      setCustomers(response || []);
    } catch (error) {
      console.error('Failed to load customers:', error);
      toast({
        title: "Error",
        description: "Failed to load customers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.Phone.includes(searchTerm) ||
    customer.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = customers.reduce((sum, customer) => sum + customer.TotalSpent, 0);

  const handleAddCustomer = async (newCustomerData: CreateCustomerInput) => {
    try {
      const newCustomer = await apiClient.createCustomer(newCustomerData);
      console.log('Customer created:', newCustomer);
      await loadCustomers(); // Reload to get fresh data
      toast({
        title: "Customer Added",
        description: `${newCustomerData.name} has been added successfully.`,
      });
    } catch (error) {
      console.error('Failed to create customer:', error);
      toast({
        title: "Error",
        description: "Failed to add customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditCustomer = async (updatedCustomerData: UpdateCustomerInput) => {
    if (!editingCustomer) return;
    
    try {
      await apiClient.updateCustomer(editingCustomer.ID, updatedCustomerData);
      await loadCustomers(); // Reload to get fresh data
      toast({
        title: "Customer Updated",
        description: `Customer has been updated successfully.`,
      });
    } catch (error) {
      console.error('Failed to update customer:', error);
      toast({
        title: "Error",
        description: "Failed to update customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    
    try {
      await apiClient.deleteCustomer(customerToDelete.ID);
      await loadCustomers(); // Reload to get fresh data
      toast({
        title: "Customer Deleted",
        description: `${customerToDelete.Name} has been deleted successfully.`,
      });
      setCustomerToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete customer:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer. Please try again.",
        variant: "destructive",
      });
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
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
          {/* <Button variant="outline" className="h-12 px-6">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </Button> */}
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
                Total Revenue: ${totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="divide-y">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg">Loading customers...</div>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div key={customer.ID} className="p-6 hover:bg-gray-50">
                {/* ...customer card content... */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-semibold text-gray-900">{customer.Name}</h3>
                    <span className={`inline-block text-sm px-3 py-1 rounded-full ${
                      customer.IsActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {customer.IsActive ? 'Active' : 'Inactive'}
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
                    <span className="text-base">{customer.Email || 'No email'}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="h-5 w-5" />
                    <span className="text-base">{customer.Phone}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <Gift className="h-5 w-5 text-pink-500" />
                    <span className="text-base">Birthday: {formatDate(customer.Birthday)}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="text-base">Anniversary: {formatDate(customer.Anniversary)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-base">
                  <div>
                    <span className="text-gray-600">Visits: </span>
                    <span className="font-semibold">{customer.TotalVisits}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Spent: </span>
                    <span className="font-semibold text-green-600">${customer.TotalSpent.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last visit: </span>
                    <span className="font-medium">{formatDate(customer.LastVisit)}</span>
                  </div>
                </div>

                {customer.Notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700"><strong>Notes:</strong> {customer.Notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {!loading && filteredCustomers.length === 0 && (
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
              Are you sure you want to delete {customerToDelete?.Name}? This action cannot be undone.
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
