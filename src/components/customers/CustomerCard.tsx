
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Mail, Phone, Gift, Heart } from "lucide-react";

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

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomerCard = ({ customer, onEdit, onDelete }: CustomerCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              {customer.customerType}
            </span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(customer)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(customer)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{customer.email}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{customer.phone}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <Gift className="h-4 w-4 text-pink-500" />
              <div>
                <p className="text-gray-500">Birthday:</p>
                <p className="font-medium">{customer.birthday}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Heart className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-gray-500">Anniversary:</p>
                <p className="font-medium">{customer.anniversary}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <p className="text-sm text-gray-500">Visits:</p>
              <p className="font-semibold text-green-600">{customer.totalVisits}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Spent:</p>
              <p className="font-semibold text-green-600">${customer.totalSpent}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last visit:</p>
              <p className="font-medium">{customer.lastVisit}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
