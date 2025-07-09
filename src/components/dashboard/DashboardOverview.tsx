
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, TrendingUp, Calendar, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient, DashboardOverview as DashboardData } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getDashboardOverview();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Loading your salon management dashboard...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Unable to load dashboard data</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Customers",
      value: (dashboardData.totalCustomers ?? 0).toString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "This Month's Revenue",
      value: `₹${dashboardData.monthlyRevenue?.toFixed(0) ?? "0"}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Invoices",
      value: (dashboardData.totalInvoices ?? 0).toString(),
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    ...(user?.role === 'owner' && dashboardData.totalEmployees !== undefined ? [{
      title: "Total Employees",
      value: dashboardData.totalEmployees.toString(),
      icon: UserCheck,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    }] : [{
      title: "Upcoming Birthdays",
      value: (dashboardData.upcomingBirthdays?.length ?? 0).toString(),
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }])
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to your salon management dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600 mb-1 truncate">{stat.title}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-full ${stat.bgColor} flex-shrink-0 ml-2`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recentCustomers?.length > 0 ? (
                dashboardData.recentCustomers.map((customer, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-600">{customer.service}</p>
                    </div>
                    <span className="text-sm text-gray-500">{customer.visitDate}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent customers</p>
              )}
            </div>
          </CardContent>
        </Card>

        {user?.role === 'owner' && dashboardData.topEmployee ? (
          <Card>
            <CardHeader>
              <CardTitle>Top Employee This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">{dashboardData.topEmployee.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{dashboardData.topEmployee.servicesProvided} services provided</p>
                <p className="text-lg font-semibold text-green-600">₹{dashboardData.topEmployee.revenue.toFixed(0)} revenue</p>
                {dashboardData.topEmployee.averageRating && (
                  <p className="text-sm text-gray-500 mt-1">⭐ {dashboardData.topEmployee.averageRating.toFixed(1)} avg rating</p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.upcomingReminders?.length > 0 ? (
                  dashboardData.upcomingReminders.map((reminder, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{reminder.name}</p>
                        <p className="text-sm text-gray-600">{reminder.type}</p>
                      </div>
                      <span className="text-sm text-gray-500">{reminder.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No upcoming reminders</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
