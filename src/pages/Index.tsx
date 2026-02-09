import {
  Phone,
  PhoneIncoming,
  PhoneForwarded,
  PhoneMissed,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { CallsChart } from "@/components/dashboard/CallsChart";
import { LiveCallItem } from "@/components/dashboard/LiveCallItem";
import { useDashboardStats, useActiveCalls } from "@/hooks/useConversations";
import { formatDuration, formatPhoneNumber, getAgentStatus, getCallDuration, getPhoneNumber, getCreatedAt } from "@/lib/conversationUtils";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activeCalls, isLoading: callsLoading } = useActiveCalls();

  const kpis = stats
    ? [
        {
          title: "Total Calls Today",
          value: stats.totalCalls,
          icon: Phone,
          trend: {
            value: Math.abs(stats.totalCalls - stats.totalCallsYesterday),
            isPositive: stats.totalCalls >= stats.totalCallsYesterday,
          },
          subtitle: `vs. ${stats.totalCallsYesterday} yesterday`,
        },
        {
          title: "AI-Answered",
          value: stats.answered,
          icon: PhoneIncoming,
          trend: {
            value: Math.abs(stats.answered - stats.answeredYesterday),
            isPositive: stats.answered >= stats.answeredYesterday,
          },
          variant: "success" as const,
          subtitle: stats.totalCalls > 0 ? `${Math.round((stats.answered / stats.totalCalls) * 100)}% of all calls` : "No calls today",
        },
        {
          title: "Transferred",
          value: stats.transferred,
          icon: PhoneForwarded,
          variant: "warning" as const,
          subtitle: stats.totalCalls > 0 ? `${Math.round((stats.transferred / stats.totalCalls) * 100)}% of all calls` : "No calls today",
        },
        {
          title: "Missed Calls",
          value: stats.missed,
          icon: PhoneMissed,
          variant: "destructive" as const,
          subtitle: stats.totalCalls > 0 ? `${Math.round((stats.missed / stats.totalCalls) * 100)}% of all calls` : "No calls today",
        },
        {
          title: "Avg. Duration",
          value: formatDuration(stats.avgDuration),
          icon: Clock,
          subtitle: stats.avgDurationYesterday > 0
            ? `${stats.avgDuration > stats.avgDurationYesterday ? 'Up from' : 'Down from'} ${formatDuration(stats.avgDurationYesterday)}`
            : "No comparison data",
        },
        {
          title: "Resolution Rate",
          value: `${stats.resolutionRate}%`,
          icon: CheckCircle2,
          trend: {
            value: Math.abs(stats.resolutionRate - stats.resolutionRateYesterday),
            isPositive: stats.resolutionRate >= stats.resolutionRateYesterday,
          },
          variant: "success" as const,
        },
      ]
    : [];

  return (
    <DashboardLayout>
      <PageHeader
        title="Overview"
        description="Monitor your AI receptionist performance at a glance"
        showStatus
        status={activeCalls && activeCalls.length > 0 ? "online" : "idle"}
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statsLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))
        ) : (
          kpis.map((kpi) => <KPICard key={kpi.title} {...kpi} />)
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <CallsChart />
        </div>

        {/* Live Calls */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-card-foreground tracking-tight">
                Active Calls
              </h3>
              <p className="text-sm text-muted-foreground tracking-tight">
                {callsLoading ? "Loading..." : `${activeCalls?.length || 0} calls in progress`}
              </p>
            </div>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10 text-success text-xs font-semibold tracking-tight">
              {activeCalls?.length || 0}
            </span>
          </div>
          <div className="space-y-3">
            {callsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))
            ) : activeCalls && activeCalls.length > 0 ? (
              activeCalls.map((call) => (
                <LiveCallItem
                  key={call.conversation_id}
                  callerNumber={formatPhoneNumber(getPhoneNumber(call))}
                  duration={formatDuration(getCallDuration(call))}
                  intent={getAgentStatus(call)}
                  confidence={85} // Default confidence
                  status="active"
                  startTimeUnix={getCreatedAt(call)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No active calls</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
