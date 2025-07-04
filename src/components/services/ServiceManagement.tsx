
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2 } from "lucide-react";
import { AddServiceDialog } from "./AddServiceDialog";
import { EditServiceDialog } from "./EditServiceDialog";
import { useToast } from "@/hooks/use-toast";
import { apiClient, Service, CreateServiceInput, UpdateServiceInput } from "@/lib/api";

export const ServiceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const servicesData = await apiClient.getServices();
        setServices(servicesData);
        console.log('Services loaded:', servicesData);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        toast({
          title: "Error",
          description: "Failed to load services. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [toast]);

  const filteredServices = services.filter(service =>
    service.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.Category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddService = async (serviceData: CreateServiceInput) => {
    try {
      const newService = await apiClient.createService(serviceData);
      setServices(prev => [...prev, newService]);
      toast({
        title: "Service Added",
        description: `${newService.Name} has been added successfully.`,
      });
      console.log('Service created:', newService);
    } catch (error) {
      console.error('Failed to create service:', error);
      toast({
        title: "Error",
        description: "Failed to create service. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditService = async (serviceId: string, serviceData: UpdateServiceInput) => {
    try {
      const updatedService = await apiClient.updateService(serviceId, serviceData);
      setServices(prev => 
        prev.map(service => 
          service.ID === serviceId ? updatedService : service
        )
      );
      toast({
        title: "Service Updated",
        description: `${updatedService.Name} has been updated successfully.`,
      });
      console.log('Service updated:', updatedService);
    } catch (error) {
      console.error('Failed to update service:', error);
      toast({
        title: "Error",
        description: "Failed to update service. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setEditDialogOpen(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      const service = services.find(s => s.ID === serviceId);
      await apiClient.deleteService(serviceId);
      setServices(prev => prev.filter(service => service.ID !== serviceId));
      toast({
        title: "Service Deleted",
        description: `${service?.Name} has been deleted successfully.`,
      });
      console.log('Service deleted:', serviceId);
    } catch (error) {
      console.error('Failed to delete service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Management</h2>
            <p className="text-gray-600">Manage your salon services and pricing</p>
          </div>
        </div>
        <Card className="p-8 text-center">
          <p className="text-gray-500">Loading services...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Management</h2>
          <p className="text-gray-600">Manage your salon services and pricing</p>
        </div>
        <AddServiceDialog onAddService={handleAddService} />
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search services by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <Card key={service.ID} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{service.Name}</CardTitle>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                    {service.Category}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteService(service.ID)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{service.Description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">₹{service.Price}</p>
                  <p className="text-sm text-gray-500">{service.Duration} min</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && !loading && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No services found matching your search.</p>
        </Card>
      )}

      <EditServiceDialog
        service={editingService}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEditService={handleEditService}
      />
    </div>
  );
};
