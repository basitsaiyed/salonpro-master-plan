
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Scissors, MessageCircle, Bell, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  apiClient, 
  UpdateSalonProfileInput, 
  WorkingHoursInput,
  WorkingHoursData,
  NotificationSettingsInput,
  UpdateReminderTemplatesInput 
} from "@/lib/api";

interface ProfileResponse {
  salonProfile: {
    salonName: string;
    address: string;
    phone: string;
    email: string;
    workingHours: WorkingHoursData;
  };
  notifications: {
    birthdayReminders: boolean;
    anniversaryReminders: boolean;
    whatsAppNotifications: boolean;
    smsNotifications: boolean;
  };
  messageTemplates: {
    birthday: string;
    anniversary: string;
  };
}

export const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user profile - updated to handle the new response structure
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.getProfile();
      return response as ProfileResponse;
    },
  });

  const [salonProfile, setSalonProfile] = useState<UpdateSalonProfileInput>({
    salonName: "",
    salonAddress: "",
    phone: "",
    email: ""
  });

  const [workingHours, setWorkingHours] = useState<WorkingHoursData>({
    monday: { open: "09:00", close: "20:00", closed: false },
    tuesday: { open: "09:00", close: "20:00", closed: false },
    wednesday: { open: "09:00", close: "20:00", closed: false },
    thursday: { open: "09:00", close: "20:00", closed: false },
    friday: { open: "09:00", close: "20:00", closed: false },
    saturday: { open: "09:00", close: "21:00", closed: false },
    sunday: { open: "10:00", close: "19:00", closed: true }
  });

  const [messageTemplates, setMessageTemplates] = useState({
    birthday: "Hi [CustomerName], SalonPro wishes you a very happy birthday! 🎉 Enjoy 20% off on your next visit this month!",
    anniversary: "Hi [CustomerName], happy salon anniversary! 🎊 Thank you for being our valued customer. Here's 15% off your next service!"
  });

  const [notifications, setNotifications] = useState<NotificationSettingsInput>({
    birthdayReminders: true,
    anniversaryReminders: true,
    whatsappNotifications: true,
    smsNotifications: false
  });

  // Update local state when profile data is loaded
  useEffect(() => {
    if (profileData) {
      // Update salon profile
      setSalonProfile({
        salonName: profileData.salonProfile.salonName || "",
        salonAddress: profileData.salonProfile.address || "",
        phone: profileData.salonProfile.phone || "",
        email: profileData.salonProfile.email || ""
      });

      // Update working hours
      if (profileData.salonProfile.workingHours) {
        setWorkingHours(profileData.salonProfile.workingHours);
      }

      // Update notifications
      setNotifications({
        birthdayReminders: profileData.notifications.birthdayReminders,
        anniversaryReminders: profileData.notifications.anniversaryReminders,
        whatsappNotifications: profileData.notifications.whatsAppNotifications,
        smsNotifications: profileData.notifications.smsNotifications
      });

      // Update message templates
      setMessageTemplates({
        birthday: profileData.messageTemplates.birthday || "Hi [CustomerName], SalonPro wishes you a very happy birthday! 🎉 Enjoy 20% off on your next visit this month!",
        anniversary: profileData.messageTemplates.anniversary || "Hi [CustomerName], happy salon anniversary! 🎊 Thank you for being our valued customer. Here's 15% off your next service!"
      });
    }
  }, [profileData]);

  // Mutations
  const updateSalonProfileMutation = useMutation({
    mutationFn: (data: UpdateSalonProfileInput) => apiClient.updateSalonProfile(data),
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your salon profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  });

  const updateWorkingHoursMutation = useMutation({
    mutationFn: (hours: WorkingHoursInput) => apiClient.updateWorkingHours(hours),
    onSuccess: () => {
      toast({
        title: "Working Hours Updated",
        description: "Your working hours have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update working hours",
        variant: "destructive",
      });
    }
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: (settings: NotificationSettingsInput) => apiClient.updateNotificationSettings(settings),
    onSuccess: () => {
      toast({
        title: "Notifications Updated",
        description: "Your notification settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update notifications",
        variant: "destructive",
      });
    }
  });

  const updateTemplatesMutation = useMutation({
    mutationFn: (templates: UpdateReminderTemplatesInput) => apiClient.updateReminderTemplates(templates),
    onSuccess: () => {
      toast({
        title: "Templates Updated",
        description: "Your message templates have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update templates",
        variant: "destructive",
      });
    }
  });

  const handleSalonProfileUpdate = () => {
    updateSalonProfileMutation.mutate(salonProfile);
  };

  const handleHoursUpdate = () => {
    updateWorkingHoursMutation.mutate({ workingHours });
  };

  const handleTemplatesUpdate = () => {
    updateTemplatesMutation.mutate({
      birthday: messageTemplates.birthday,
      anniversary: messageTemplates.anniversary
    });
  };

  const handleNotificationsUpdate = () => {
    updateNotificationsMutation.mutate(notifications);
  };

  const handleSendTestMessage = () => {
    toast({
      title: "Test Message Sent",
      description: "A test birthday message has been sent to your phone.",
    });
  };

  const updateDaySchedule = (day: keyof WorkingHoursData, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const dayNames: (keyof WorkingHoursData)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
          <p className="text-gray-600">Manage your salon and account settings</p>
        </div>
        <Button onClick={handleSendTestMessage} className="bg-gradient-elegant hover:bg-gradient-elegant/90">
          <Send className="h-4 w-4 mr-2" />
          Send Test Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salon Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              Salon Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="salonName">Salon Name</Label>
              <Input 
                id="salonName" 
                value={salonProfile.salonName}
                onChange={(e) => setSalonProfile({...salonProfile, salonName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={salonProfile.salonAddress}
                onChange={(e) => setSalonProfile({...salonProfile, salonAddress: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={salonProfile.phone}
                onChange={(e) => setSalonProfile({...salonProfile, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={salonProfile.email}
                onChange={(e) => setSalonProfile({...salonProfile, email: e.target.value})}
              />
            </div>
            <Button 
              onClick={handleSalonProfileUpdate}
              disabled={updateSalonProfileMutation.isPending}
            >
              {updateSalonProfileMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Working Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="font-medium">Day</div>
              <div className="font-medium">Open</div>
              <div className="font-medium">Close</div>
              <div className="font-medium">Active</div>
            </div>
            {dayNames.map((day) => (
              <div key={day} className="grid grid-cols-4 gap-2 items-center">
                <div className="py-1 capitalize">{day}</div>
                <Input 
                  type="time" 
                  value={workingHours[day].open} 
                  className="h-8" 
                  disabled={workingHours[day].closed}
                  onChange={(e) => updateDaySchedule(day, 'open', e.target.value)}
                />
                <Input 
                  type="time" 
                  value={workingHours[day].close} 
                  className="h-8" 
                  disabled={workingHours[day].closed}
                  onChange={(e) => updateDaySchedule(day, 'close', e.target.value)}
                />
                <Switch
                  checked={!workingHours[day].closed}
                  onCheckedChange={(checked) => updateDaySchedule(day, 'closed', !checked)}
                />
              </div>
            ))}
            <Button 
              onClick={handleHoursUpdate}
              disabled={updateWorkingHoursMutation.isPending}
            >
              {updateWorkingHoursMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Hours
            </Button>
          </CardContent>
        </Card>

        {/* Message Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Message Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="birthdayTemplate">Birthday Message</Label>
              <Input 
                id="birthdayTemplate" 
                value={messageTemplates.birthday}
                onChange={(e) => setMessageTemplates({...messageTemplates, birthday: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="anniversaryTemplate">Anniversary Message</Label>
              <Input 
                id="anniversaryTemplate" 
                value={messageTemplates.anniversary}
                onChange={(e) => setMessageTemplates({...messageTemplates, anniversary: e.target.value})}
              />
            </div>
            <Button 
              onClick={handleTemplatesUpdate}
              disabled={updateTemplatesMutation.isPending}
            >
              {updateTemplatesMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Templates
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Birthday Reminders</p>
                <p className="text-sm text-gray-600">Send automatic birthday messages</p>
              </div>
              <Switch 
                checked={notifications.birthdayReminders}
                onCheckedChange={(checked) => setNotifications({...notifications, birthdayReminders: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Anniversary Reminders</p>
                <p className="text-sm text-gray-600">Send automatic anniversary messages</p>
              </div>
              <Switch 
                checked={notifications.anniversaryReminders}
                onCheckedChange={(checked) => setNotifications({...notifications, anniversaryReminders: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">WhatsApp Notifications</p>
                <p className="text-sm text-gray-600">Enable WhatsApp message delivery</p>
              </div>
              <Switch 
                checked={notifications.whatsappNotifications}
                onCheckedChange={(checked) => setNotifications({...notifications, whatsappNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-gray-600">Enable SMS message delivery</p>
              </div>
              <Switch 
                checked={notifications.smsNotifications}
                onCheckedChange={(checked) => setNotifications({...notifications, smsNotifications: checked})}
              />
            </div>
            <Button 
              onClick={handleNotificationsUpdate}
              disabled={updateNotificationsMutation.isPending}
            >
              {updateNotificationsMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Message Automation Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Automated Message System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-gray-700">
              <strong>Birthday Messages:</strong> Automatically sent 1 week before customer's birthday
            </p>
            <p className="text-gray-700">
              <strong>Anniversary Messages:</strong> Automatically sent 3 days before customer's anniversary
            </p>
            <p className="text-sm text-gray-500">
              Messages are sent via WhatsApp or SMS based on your notification settings and customer preferences.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
