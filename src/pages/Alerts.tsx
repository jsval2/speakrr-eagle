import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bell, Phone, AlertTriangle, XCircle, Mail, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const alertSettings = [
  {
    id: "missed-calls",
    icon: Phone,
    title: "Missed Calls",
    description: "Get notified when a call goes unanswered",
    defaultEnabled: true,
  },
  {
    id: "ai-downtime",
    icon: AlertTriangle,
    title: "AI Downtime",
    description: "Alert when the AI receptionist goes offline",
    defaultEnabled: true,
  },
  {
    id: "failed-calls",
    icon: XCircle,
    title: "Failed Calls",
    description: "Notify on calls that failed to connect",
    defaultEnabled: true,
  },
  {
    id: "low-confidence",
    icon: AlertTriangle,
    title: "Low Confidence Calls",
    description: "Alert when AI confidence drops below threshold",
    defaultEnabled: false,
  },
  {
    id: "high-volume",
    icon: Bell,
    title: "High Call Volume",
    description: "Notify when call volume exceeds normal levels",
    defaultEnabled: false,
  },
];

const Alerts = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your alert preferences have been updated.",
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Alerts & Notifications"
        description="Configure how and when you receive important updates"
      >
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alert Types */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50">
            <h3 className="text-base font-semibold mb-1">Alert Types</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Choose which events trigger notifications
            </p>

            <div className="space-y-4">
              {alertSettings.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center border border-border">
                      <alert.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked={alert.defaultEnabled} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="space-y-4">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50">
            <h3 className="text-base font-semibold mb-1">Delivery</h3>
            <p className="text-sm text-muted-foreground mb-6">
              How to receive alerts
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">SMS</span>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Push</span>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50">
            <h3 className="text-base font-semibold mb-1">Summary Reports</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Receive periodic summaries
            </p>

            <div className="space-y-4">
              <div>
                <Label className="text-sm">Daily Summary</Label>
                <Select defaultValue="6pm">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disabled">Disabled</SelectItem>
                    <SelectItem value="9am">9:00 AM</SelectItem>
                    <SelectItem value="6pm">6:00 PM</SelectItem>
                    <SelectItem value="9pm">9:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Weekly Summary</Label>
                <Select defaultValue="monday">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disabled">Disabled</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
