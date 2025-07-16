
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, FileText, Calendar, Download, UserCheck, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export const Reports = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['reports'],
    queryFn: () => apiClient.getReports(),
  });

  // const { data: employeeAnalytics, isLoading: employeeLoading } = useQuery({
  //   queryKey: ['employee-analytics'],
  //   queryFn: () => apiClient.getEmployeeAnalytics(),
  //   enabled: user?.role === 'owner'
  // });

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h2>
            <p className="text-gray-600">Loading your salon's performance data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h2>
          <p className="text-red-600">Failed to load analytics data. Please try again.</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
        {[
          { title: "This Month", value: analytics?.currentMonthRevenue, growth: analytics?.monthGrowth },
          { title: "This Quarter", value: analytics?.currentQuarterRevenue, growth: analytics?.quarterGrowth },
          { title: "This Year", value: analytics?.currentYearRevenue, growth: analytics?.yearGrowth }
        ].map(({ title, value, growth }, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(value || 0)}</p>
                  <p className={`text-sm ${growth && growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatGrowth(growth || 0)} from last period
                  </p>
                </div>
                <TrendingUp className={`h-8 w-8 ${growth && growth >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Services and Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Top Services</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.topServices?.length ? analytics.topServices.map((service, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-600">{service.count} services</p>
                  </div>
                  <p className="font-bold text-green-600">{formatCurrency(service.revenue)}</p>
                </div>
              )) : <p className="text-gray-500 text-center py-4">No service data available</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Customers</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.topCustomers?.length ? analytics.topCustomers.map((customer, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.visits} visits</p>
                  </div>
                  <p className="font-bold text-green-600">{formatCurrency(customer.spent)}</p>
                </div>
              )) : <p className="text-gray-500 text-center py-4">No customer data available</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Top Employees</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.topEmployees?.length ? analytics.topEmployees.map((emp, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{emp.name}</p>
                    <p className="text-sm text-gray-600">{emp.servicesHandled} services handled</p>
                  </div>
                  <p className="font-bold text-green-600">{formatCurrency(emp.revenue)}</p>
                </div>
              )) : <p className="text-gray-500 text-center py-4">No employee data available</p>}
            </div>
          </CardContent>
        </Card>

        {/* Employee Service Summary */}
        <Card>
          <CardHeader><CardTitle>Employee Service Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.employeeServiceSummary?.length ? analytics.employeeServiceSummary.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{item.employeeName}</p>
                    <p className="text-sm text-gray-600">{item.serviceName} - {item.count} times</p>
                  </div>
                  <p className="font-bold text-green-600">{formatCurrency(item.revenue)}</p>
                </div>
              )) : <p className="text-gray-500 text-center py-4">No service summary data</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Statistics */}
      <Card>
        <CardHeader><CardTitle>Quick Statistics</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{analytics?.quickStats.totalCustomers || 0}</p>
              <p className="text-sm text-gray-600">Total Customers</p>
            </div>
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{analytics?.quickStats.totalInvoices || 0}</p>
              <p className="text-sm text-gray-600">Total Invoices</p>
            </div>
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{analytics?.quickStats.avgMonthlyVisits?.toFixed(0) || 0}</p>
              <p className="text-sm text-gray-600">Avg. Monthly Visits</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics?.quickStats.avgOrderValue || 0)}</p>
              <p className="text-sm text-gray-600">Avg. Order Value</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
