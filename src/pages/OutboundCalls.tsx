import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  FileSpreadsheet,
  X,
  PhoneOutgoing,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Play,
  Pause,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const campaignSubjects = [
  { value: "waitlist-upsell", label: "Waitlist Upsell" },
  { value: "check-in-due", label: "Check-in due" },
];

// Mock data for the chart
const chartData = [
  { date: "Mon", calls: 45, connected: 32, booked: 8 },
  { date: "Tue", calls: 52, connected: 41, booked: 12 },
  { date: "Wed", calls: 38, connected: 29, booked: 7 },
  { date: "Thu", calls: 67, connected: 54, booked: 15 },
  { date: "Fri", calls: 71, connected: 58, booked: 18 },
  { date: "Sat", calls: 23, connected: 18, booked: 5 },
  { date: "Sun", calls: 12, connected: 9, booked: 2 },
];

// Mock active campaigns
const activeCampaigns = [
  {
    id: 1,
    name: "Waitlist Upsell - Feb Batch",
    subject: "Waitlist Upsell",
    status: "active",
    progress: 67,
    total: 150,
    completed: 101,
    connected: 78,
    booked: 23,
    startedAt: "2 hours ago",
  },
  {
    id: 2,
    name: "Check-in Reminders Q1",
    subject: "Check-in due",
    status: "active",
    progress: 34,
    total: 89,
    completed: 30,
    connected: 24,
    booked: 8,
    startedAt: "45 min ago",
  },
  {
    id: 3,
    name: "Waitlist - Premium Members",
    subject: "Waitlist Upsell",
    status: "paused",
    progress: 82,
    total: 45,
    completed: 37,
    connected: 31,
    booked: 11,
    startedAt: "Yesterday",
  },
];

// Mock stats
const stats = {
  totalCampaigns: 12,
  callsMade: 1847,
  successRate: 76,
  appointmentsBooked: 142,
};

interface UploadedFile {
  name: string;
  size: number;
  rows: number;
}

const OutboundCalls = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split("\n").filter((row) => row.trim()).length - 1;
        setUploadedFile({
          name: file.name,
          size: file.size,
          rows: Math.max(0, rows),
        });
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const canStartCampaign = selectedSubject && uploadedFile;

  return (
    <DashboardLayout>
      <PageHeader
        title="Outbound Calls"
        description="Manage AI-powered outbound call campaigns"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <PhoneOutgoing className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Campaigns
            </span>
          </div>
          <p className="text-2xl font-semibold">{stats.totalCampaigns}</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </div>
        <div className="bg-card border border-border/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Calls Made
            </span>
          </div>
          <p className="text-2xl font-semibold">{stats.callsMade.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Total outbound</p>
        </div>
        <div className="bg-card border border-border/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Connect Rate
            </span>
          </div>
          <p className="text-2xl font-semibold text-success">{stats.successRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">Avg. connection</p>
        </div>
        <div className="bg-card border border-border/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Booked
            </span>
          </div>
          <p className="text-2xl font-semibold">{stats.appointmentsBooked}</p>
          <p className="text-xs text-muted-foreground mt-1">Appointments</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Chart & Active Campaigns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart */}
          <div className="bg-card border border-border/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium">Campaign Performance</h3>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 bg-primary" />
                  <span className="text-muted-foreground">Calls</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 bg-primary/50" />
                  <span className="text-muted-foreground">Connected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 bg-success" />
                  <span className="text-muted-foreground">Booked</span>
                </div>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 0,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="calls"
                    stackId="1"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="connected"
                    stackId="2"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.15}
                  />
                  <Area
                    type="monotone"
                    dataKey="booked"
                    stackId="3"
                    stroke="hsl(var(--success))"
                    fill="hsl(var(--success))"
                    fillOpacity={0.4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="bg-card border border-border/50">
            <div className="p-4 border-b border-border/50">
              <h3 className="text-sm font-medium">Active Campaigns</h3>
              <p className="text-xs text-muted-foreground">Currently running or paused</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-medium text-xs">Campaign</TableHead>
                  <TableHead className="font-medium text-xs">Progress</TableHead>
                  <TableHead className="font-medium text-xs text-center">Connected</TableHead>
                  <TableHead className="font-medium text-xs text-center">Booked</TableHead>
                  <TableHead className="font-medium text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{campaign.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] py-0">
                            {campaign.subject}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {campaign.startedAt}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {campaign.completed}/{campaign.total}
                          </span>
                          <span className="font-medium">{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-mono text-sm">{campaign.connected}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-mono text-sm text-success">{campaign.booked}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 w-7 p-0",
                          campaign.status === "active"
                            ? "text-warning hover:text-warning"
                            : "text-success hover:text-success"
                        )}
                      >
                        {campaign.status === "active" ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Right Column - New Campaign */}
        <div className="space-y-4">
          <div className="bg-card border border-border/50 p-6">
            <h3 className="text-sm font-medium mb-1">New Campaign</h3>
            <p className="text-xs text-muted-foreground mb-6">
              Upload contacts and launch a new outbound campaign
            </p>

            {/* Campaign Subject Dropdown */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Campaign Subject
              </label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select purpose..." />
                </SelectTrigger>
                <SelectContent>
                  {campaignSubjects.map((subject) => (
                    <SelectItem key={subject.value} value={subject.value}>
                      {subject.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CSV Upload Area */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Contact List
              </label>

              {!uploadedFile ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed p-6 text-center cursor-pointer transition-all",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <Upload
                    className={cn(
                      "h-8 w-8 mx-auto mb-3",
                      isDragging ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <p className="text-sm font-medium mb-1">
                    {isDragging ? "Drop file" : "Upload CSV"}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Drag & drop or click
                  </p>
                </div>
              ) : (
                <div className="border border-border bg-muted/30 p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-success/10 border border-success/30 flex items-center justify-center">
                        <FileSpreadsheet className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="text-xs font-medium">{uploadedFile.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatFileSize(uploadedFile.size)} • {uploadedFile.rows} contacts
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Start Campaign Button */}
            <Button
              size="lg"
              disabled={!canStartCampaign}
              className="w-full gap-2"
            >
              <PhoneOutgoing className="h-4 w-4" />
              Start Campaign
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="bg-muted/30 border border-border/50 p-4">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">
              Today's Activity
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Calls in queue</span>
                <span className="text-sm font-mono font-medium">127</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Avg. call duration</span>
                <span className="text-sm font-mono font-medium">2:34</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Conversion rate</span>
                <span className="text-sm font-mono font-medium text-success">18.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OutboundCalls;
