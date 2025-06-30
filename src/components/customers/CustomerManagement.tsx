
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  anniversary: string;
  totalVisits: number;
  lastVisit: string;
}

export const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock customer data
  const customers: Customer[] = [
    {
      id: "1",
      name: "Priya Sharma",
      phone: "+91 98765 43210",
      email: "priya@example.com",
      birthday: "15 Mar",
      anniversary: "20 Dec",
      totalVisits: 12,
      lastVisit: "2 days ago"
    },
    {
      id: "2",
      name: "Rahul Kumar",
      phone: "+91 87654 32109",
      email: "rahul@example.com",
      birthday: "08 Jul",
      anniversary: "10 Feb",
      totalVisits: 8,
      lastVisit: "1 week ago"
    },
    {
      id: "3",
      name: "Sneha Patel",
      phone: "+91 76543 21098",
      email: "sneha@example.com",
      birthday: "22 Nov",
      anniversary: "05 Jun",
      totalVisits: 15,
      lastVisit: "Today"
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Management</h2>
          <p className="text-gray-600">Manage your salon customers</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
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

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Special Dates</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Visits</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Visit</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{customer.phone}</p>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-gray-900">Birthday: {customer.birthday}</p>
                        <p className="text-sm text-gray-600">Anniversary: {customer.anniversary}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                        {customer.totalVisits}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {customer.lastVisit}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
