import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { LiveCallItem } from "@/components/dashboard/LiveCallItem";
import { StatusIndicator } from "@/components/dashboard/StatusIndicator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { useActiveCalls } from "@/hooks/useConversations";
import { formatPhoneNumber, formatDuration, getCallDuration, getAgentStatus, getPhoneNumber, getCreatedAt } from "@/lib/conversationUtils";
import { useQueryClient } from "@tanstack/react-query";

const LiveCalls = () => {
  const { data: activeCalls, isLoading, refetch } = useActiveCalls();
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
    refetch();
  };

  const activeCount = activeCalls?.length || 0;

  return (
    <DashboardLayout>
      <PageHeader
        title="Live Calls"
        description="Monitor and manage calls in real-time"
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </PageHeader>

      {/* Status Summary */}
      <div className="flex items-center gap-6 mb-6 p-4 bg-card rounded-lg border border-border/50">
        <div className="flex items-center gap-2">
          <StatusIndicator
            status={activeCount > 0 ? "online" : "idle"}
            size="sm"
            showLabel={false}
          />
          <span className="text-sm font-medium text-card-foreground">
            {activeCount > 0 ? "AI Receptionist Active" : "AI Receptionist Idle"}
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-success">{activeCount}</span>{" "}
          active {activeCount === 1 ? 'call' : 'calls'}
        </div>
      </div>

      {/* Calls List */}
      <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-card-foreground">
              Active Calls
            </h3>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring of in-progress calls
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {isLoading ? (
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
                confidence={85}
                status="active"
                startTimeUnix={getCreatedAt(call)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No active calls at the moment</p>
              <p className="text-xs mt-2">Calls will appear here in real-time when they start</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span>Active Call</span>
        </div>
        <div className="text-xs">
          Updates automatically every 2 seconds
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LiveCalls;
