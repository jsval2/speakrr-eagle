import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { AIInsight } from "@/components/dashboard/AIInsight";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, Phone, CheckCircle2, Clock, Sparkles } from "lucide-react";

const weeklyData = [
  { day: "Mon", calls: 145, resolved: 132 },
  { day: "Tue", calls: 156, resolved: 142 },
  { day: "Wed", calls: 178, resolved: 165 },
  { day: "Thu", calls: 134, resolved: 128 },
  { day: "Fri", calls: 189, resolved: 176 },
  { day: "Sat", calls: 67, resolved: 62 },
  { day: "Sun", calls: 45, resolved: 42 },
];

const hourlyData = [
  { hour: "8AM", calls: 8 },
  { hour: "9AM", calls: 22 },
  { hour: "10AM", calls: 31 },
  { hour: "11AM", calls: 28 },
  { hour: "12PM", calls: 15 },
  { hour: "1PM", calls: 19 },
  { hour: "2PM", calls: 35 },
  { hour: "3PM", calls: 29 },
  { hour: "4PM", calls: 24 },
  { hour: "5PM", calls: 12 },
];

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="AI Analytics"
          description="Autonomous insights from your call transcripts"
        />
        <div className="flex items-center gap-2 px-3 py-1.5 border border-primary/20 bg-primary/5">
          <Sparkles className="h-3 w-3 text-primary animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
            AI ANALYZING
          </span>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="This Week"
          value="914"
          subtitle="Total calls handled"
          icon={Phone}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Resolution Rate"
          value="92%"
          subtitle="AI handled successfully"
          icon={CheckCircle2}
          variant="success"
          trend={{ value: 3, isPositive: true }}
        />
        <KPICard
          title="Avg. Handle Time"
          value="2:18"
          subtitle="Per call"
          icon={Clock}
        />
        <KPICard
          title="Peak Hour"
          value="2 PM"
          subtitle="35 calls avg"
          icon={TrendingUp}
        />
      </div>

      {/* AI Insights Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-bold tracking-tight">AI-Generated Business Insights</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AIInsight
            type="insight"
            title="Appointment Booking Surge Detected"
            description="Your AI handled 42% more appointment bookings this week compared to last week. Peak booking requests occur between 2-3 PM. Consider highlighting available afternoon slots in your AI greeting to capitalize on this trend."
            metric={{ value: "42%", change: 15, label: "vs last week" }}
            priority="high"
          />
          <AIInsight
            type="recommendation"
            title="Optimize Lunch Hour Coverage"
            description="Call volume drops 37% during 12-1 PM, but callers experience longer wait times. The AI suggests redistributing resources or adjusting your greeting to set expectations during this period."
            metric={{ value: "37%", change: -12, label: "call drop" }}
          />
          <AIInsight
            type="trend"
            title="Insurance Questions Increasing"
            description="Insurance-related inquiries have grown 23% over the past two weeks. Most questions center around coverage verification and claim status. Consider updating your AI's insurance knowledge base."
            metric={{ value: "+23%", change: 23, label: "2-week trend" }}
          />
          <AIInsight
            type="alert"
            title="Weekend Call Volume Declining"
            description="Saturday and Sunday calls have decreased 18% month-over-month. This may indicate reduced awareness of your weekend availability. The AI recommends promoting weekend hours more prominently."
            metric={{ value: "-18%", change: -18, label: "vs last month" }}
            priority="medium"
          />
        </div>
      </div>

      {/* Key Patterns Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold tracking-tight mb-4">Call Pattern Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AIInsight
            type="insight"
            title="Top Caller Intent"
            description="Appointment booking remains the #1 reason for calls (42%), followed by rescheduling (23%). Your AI successfully handles 95% of these requests without human intervention."
          />
          <AIInsight
            type="insight"
            title="Resolution Success Rate"
            description="AI resolution rate improved from 89% to 92% this week. Most successful category: appointment booking (98% resolved). Lowest: complex insurance queries (76% resolved)."
          />
          <AIInsight
            type="recommendation"
            title="Training Opportunity"
            description="New patient inquiries show a 15% escalation rate to human staff. Consider expanding the AI's onboarding script to cover common first-visit questions more thoroughly."
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Call Volume */}
        <div className="bg-card p-6 border border-border hover:border-border-strong transition-colors">
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-text-muted mb-1">
            Weekly Performance
          </h3>
          <p className="text-sm mb-6 tracking-tighter">
            Total calls vs. AI-resolved calls by day
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(240, 100%, 50%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(240, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(158, 64%, 52%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(158, 64%, 52%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--text-muted))", fontSize: 10, fontFamily: "JetBrains Mono" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--text-muted))", fontSize: 10, fontFamily: "JetBrains Mono" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0",
                    fontFamily: "JetBrains Mono",
                    fontSize: "11px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="calls"
                  stroke="hsl(240, 100%, 50%)"
                  strokeWidth={2}
                  fill="url(#colorCalls)"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="hsl(158, 64%, 52%)"
                  strokeWidth={2}
                  fill="url(#colorResolved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-primary" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                Total Calls
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-success" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                AI Resolved
              </span>
            </div>
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="bg-card p-6 border border-border hover:border-border-strong transition-colors">
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-text-muted mb-1">
            Hourly Distribution
          </h3>
          <p className="text-sm mb-6 tracking-tighter">
            Average call volume by time of day
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--text-muted))", fontSize: 10, fontFamily: "JetBrains Mono" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--text-muted))", fontSize: 10, fontFamily: "JetBrains Mono" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0",
                    fontFamily: "JetBrains Mono",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="calls" fill="hsl(240, 100%, 50%)" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-start gap-4">
          <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm mb-2 tracking-tight">
              AI Continuous Learning Active
            </h3>
            <p className="text-sm text-text-secondary tracking-tighter leading-relaxed">
              Your AI receptionist analyzes every call transcript to identify patterns, improve responses,
              and generate actionable business insights. These recommendations are updated in real-time as
              new data becomes available.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
