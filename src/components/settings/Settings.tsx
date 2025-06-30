
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, MessageCircle, Bell, User } from "lucide-react";

export const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your salon and account settings</p>
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
              <Input id="salonName" defaultValue="Elite Beauty Salon" />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue="123 Main Street, Mumbai, India" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+91 98765 43210" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="salon@example.com" />
            </div>
            <Button>Update Profile</Button>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Working Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="font-medium">Day</div>
              <div className="font-medium">Open</div>
              <div className="font-medium">Close</div>
            </div>
            {[
              { day: "Monday", open: "09:00", close: "20:00" },
              { day: "Tuesday", open: "09:00", close: "20:00" },
              { day: "Wednesday", open: "09:00", close: "20:00" },
              { day: "Thursday", open: "09:00", close: "20:00" },
              { day: "Friday", open: "09:00", close: "20:00" },
              { day: "Saturday", open: "09:00", close: "21:00" },
              { day: "Sunday", open: "10:00", close: "19:00" }
            ].map((schedule, index) => (
              <div key={index} className="grid grid-cols-3 gap-2">
                <div className="py-1">{schedule.day}</div>
                <Input type="time" defaultValue={schedule.open} className="h-8" />
                <Input type="time" defaultValue={schedule.close} className="h-8" />
              </div>
            ))}
            <Button>Update Hours</Button>
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
                defaultValue="Happy Birthday, [CustomerName]! 🎉 Treat yourself to a special salon session. Call us to book!"
              />
            </div>
            <div>
              <Label htmlFor="anniversaryTemplate">Anniversary Message</Label>
              <Input 
                id="anniversaryTemplate" 
                defaultValue="Happy Anniversary, [CustomerName]! 💕 Celebrate with a couple's spa session. Contact us today!"
              />
            </div>
            <Button>Update Templates</Button>
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
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Anniversary Reminders</p>
                <p className="text-sm text-gray-600">Send automatic anniversary messages</p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">WhatsApp Notifications</p>
                <p className="text-sm text-gray-600">Enable WhatsApp message delivery</p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-gray-600">Enable SMS message delivery</p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
            <Button>Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
