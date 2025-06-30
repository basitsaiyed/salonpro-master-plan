
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
}

export const ServiceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock service data
  const services: Service[] = [
    {
      id: "1",
      name: "Hair Cut & Styling",
      description: "Professional hair cutting and styling",
      price: 500,
      duration: "45 min",
      category: "Hair"
    },
    {
      id: "2",
      name: "Beard Trim",
      description: "Precision beard trimming and shaping",
      price: 200,
      duration: "20 min",
      category: "Grooming"
    },
    {
      id: "3",
      name: "Facial Treatment",
      description: "Deep cleansing facial with moisturizing",
      price: 800,
      duration: "60 min",
      category: "Skincare"
    },
    {
      id: "4",
      name: "Hair Coloring",
      description: "Professional hair coloring service",
      price: 2000,
      duration: "120 min",
      category: "Hair"
    },
    {
      id: "5",
      name: "Manicure",
      description: "Complete nail care and polish",
      price: 300,
      duration: "30 min",
      category: "Nails"
    }
  ];

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Management</h2>
          <p className="text-gray-600">Manage your salon services and pricing</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
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
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                    {service.category}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{service.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">₹{service.price}</p>
                  <p className="text-sm text-gray-500">{service.duration}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No services found matching your search.</p>
        </Card>
      )}
    </div>
  );
};
