
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, FileText, Calendar, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Reports = () => {
  const { toast } = useToast();

  const handleExportReports = () => {
    toast({
      title: "Exporting Reports",
      description: "Your reports are being exported to PDF. Download will start shortly.",
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Reports have been downloaded successfully.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h2>
          <p className="text-gray-600">Track your salon's performance and insights</p>
        </div>
        <Button variant="outline" onClick={handleExportReports}>
          <Download className="h-4 w-4 mr-2" />
          Export Reports
        </Button>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-2xl font-bold text-gray-900">₹45,230</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Quarter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-2xl font-bold text-gray-900">₹1,35,680</p>
                <p className="text-sm text-green-600">+8% from last quarter</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-2xl font-bold text-gray-900">₹4,82,150</p>
                <p className="text-sm text-green-600">+15% from last year</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { service: "Hair Cut & Styling", count: 45, revenue: 22500 },
                { service: "Facial Treatment", count: 32, revenue: 25600 },
                { service: "Hair Coloring", count: 18, revenue: 36000 },
                { service: "Beard Trim", count: 28, revenue: 5600 }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{item.service}</p>
                    <p className="text-sm text-gray-600">{item.count} services</p>
                  </div>
                  <p className="font-bold text-green-600">₹{item.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Priya Sharma", visits: 12, spent: 8500 },
                { name: "Sneha Patel", visits: 15, spent: 12000 },
                { name: "Anjali Gupta", visits: 9, spent: 6500 },
                { name: "Meera Joshi", visits: 8, spent: 5200 }
              ].map((customer, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.visits} visits</p>
                  </div>
                  <p className="font-bold text-green-600">₹{customer.spent}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">142</p>
              <p className="text-sm text-gray-600">Total Customers</p>
            </div>
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-sm text-gray-600">Total Invoices</p>
            </div>
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-sm text-gray-600">Avg. Monthly Visits</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">₹1,580</p>
              <p className="text-sm text-gray-600">Avg. Order Value</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
