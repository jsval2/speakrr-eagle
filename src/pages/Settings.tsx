import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Link2, Users, Plus, Trash2, ExternalLink, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const phoneNumbers = [
  { number: "+1 (555) 123-4567", label: "Main Line", status: "active" },
  { number: "+1 (555) 987-6543", label: "After Hours", status: "active" },
];

const integrations = [
  {
    name: "Google Calendar",
    description: "Sync appointments automatically",
    connected: true,
    icon: "📅",
  },
  {
    name: "Salesforce",
    description: "Log calls and caller info",
    connected: false,
    icon: "☁️",
  },
  {
    name: "Slack",
    description: "Get notifications in Slack",
    connected: true,
    icon: "💬",
  },
  {
    name: "HubSpot",
    description: "Sync with your CRM",
    connected: false,
    icon: "🔶",
  },
];

const teamMembers = [
  { name: "John Smith", email: "john@dentalclinic.com", role: "Owner" },
  { name: "Sarah Johnson", email: "sarah@dentalclinic.com", role: "Admin" },
  { name: "Mike Wilson", email: "mike@dentalclinic.com", role: "Member" },
];

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Settings"
        description="Manage your account, integrations, and team"
      >
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </PageHeader>

      <Tabs defaultValue="phone" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="phone" className="gap-2">
            <Phone className="h-4 w-4" />
            Phone Numbers
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Link2 className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
        </TabsList>

        {/* Phone Numbers */}
        <TabsContent value="phone" className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold">Connected Phone Numbers</h3>
                <p className="text-sm text-muted-foreground">
                  Manage phone numbers connected to your AI receptionist
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Number
              </Button>
            </div>

            <div className="space-y-3">
              {phoneNumbers.map((phone, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center border border-border">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{phone.number}</p>
                      <p className="text-xs text-muted-foreground">{phone.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Active
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50">
            <h3 className="text-base font-semibold mb-1">Available Integrations</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Connect your favorite tools to enhance your AI receptionist
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map((integration, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center border border-border text-xl">
                      {integration.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{integration.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  {integration.connected ? (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Connected
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-2">
                      Connect
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team" className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold">Team Members</h3>
                <p className="text-sm text-muted-foreground">
                  Manage who has access to your dashboard
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Invite Member
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.email}
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={member.role.toLowerCase()}>
                        <SelectTrigger className="w-28 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {member.role !== "Owner" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Invite Form */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50">
            <h3 className="text-base font-semibold mb-4">Invite New Member</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label className="text-sm">Email Address</Label>
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  className="mt-2"
                />
              </div>
              <div className="w-32">
                <Label className="text-sm">Role</Label>
                <Select defaultValue="member">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button>Send Invite</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
